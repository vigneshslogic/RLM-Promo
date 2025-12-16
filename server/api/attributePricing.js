import axios from "axios";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("Attribute Pricing Request Body:", body);
  const config = useRuntimeConfig();

  const runQuery = async (query) => {
    const q = encodeURIComponent(query);
    const url = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/query/?q=${q}`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  try {
    const { 
      productId, 
      productSellingModelId, 
      sellingModelType, 
      attributeValue, 
      attributeOperator = "equals", 
      basePrice 
    } = body.payload;

    console.log(`Calculating attribute price for Product: ${productId}, Attribute: ${attributeValue}`);

    const conditionQuery = `SELECT AttributeBasedAdjRuleId 
                            FROM AttributeAdjustmentCondition 
                            WHERE ProductId = '${productId}' 
                            AND StringValue = '${attributeValue}' 
                            AND Operator = '${attributeOperator}'
                            LIMIT 1`;

    const conditionResponse = await runQuery(conditionQuery);
    
    if (!conditionResponse.data?.records?.length) {
      return {
        success: false,
        message: "No matching Attribute Condition found for this product and attribute value.",
        calculatedPrice: basePrice 
      };
    }

    const ruleId = conditionResponse.data.records[0].AttributeBasedAdjRuleId;

    const adjustmentQuery = `SELECT Id, AdjustmentType, AdjustmentValue 
                             FROM AttributeBasedAdjustment 
                             WHERE AttributeBasedAdjRuleId = '${ruleId}' 
                             AND ProductId = '${productId}' 
                             AND ProductSellingModelId = '${productSellingModelId}'
                             AND SellingModelType = '${sellingModelType}'
                             LIMIT 1`;

    const adjustmentResponse = await runQuery(adjustmentQuery);

    if (!adjustmentResponse.data?.records?.length) {
      return {
        success: false,
        message: "Condition found, but no Adjustment record exists for this Selling Model.",
        calculatedPrice: basePrice
      };
    }

    const adjustmentRecord = adjustmentResponse.data.records[0];
    const adjustmentValue = adjustmentRecord.AdjustmentValue; 
    const adjustmentType = adjustmentRecord.AdjustmentType;  

    let newPrice = basePrice;
    let appliedAdjustment = 0;

    if (adjustmentType === 'Percentage') {
      appliedAdjustment = basePrice * (adjustmentValue / 100);
      newPrice = appliedAdjustment;
    } else {
      appliedAdjustment = adjustmentValue;
      newPrice = adjustmentValue;
    }

    return {
      success: true,
      productId: productId,
      basePrice: basePrice,
      attribute: attributeValue,
      appliedRuleId: ruleId,
      adjustmentDetails: {
        type: adjustmentType,
        value: adjustmentValue,
        calculatedAdjustment: appliedAdjustment
      },
      finalPrice: parseFloat(newPrice.toFixed(2))
    };

  } catch (error) {
    console.error("Price Calculation Error:", error);
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    });
  }
});