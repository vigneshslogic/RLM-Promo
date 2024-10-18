import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); 
  const config = useRuntimeConfig();

  try {
    const url = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/query/?q=SELECT id, Name, Catalog.Name, Catalog.Id, SortOrder, ParentCategory.Name, (Select Id, Name, Catalog.Name, Catalog.Id, SortOrder From ChildCategories) from ProductCategory where Catalog.Name IN ${encodeURIComponent(body.catalog)} and ParentCategory.Name = null`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return response.data;
    }
    
    return false;
  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});