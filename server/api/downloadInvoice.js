import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  try {
    const apiVersion = parseFloat(config.api_version).toFixed(1);

    const linkUrl = `${config.api_endpoint}/services/data/v${apiVersion}/query?q=` +
      `SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = '${body.invoiceId}' LIMIT 1`;

    const linkRes = await axios.get(linkUrl, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!linkRes.data.records.length) {
      throw new Error('No file is linked to this invoice.');
    }

    const contentDocumentId = linkRes.data.records[0].ContentDocumentId;

    const versionUrl = `${config.api_endpoint}/services/data/v${apiVersion}/query?q=` +
      `SELECT Id, Title, VersionData, FileExtension 
       FROM ContentVersion 
       WHERE ContentDocumentId = '${contentDocumentId}' 
       ORDER BY CreatedDate DESC 
       LIMIT 1`;

    const versionRes = await axios.get(versionUrl, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!versionRes.data.records.length) {
      throw new Error('No version found for the invoice document.');
    }

    const fileMeta = versionRes.data.records[0];

    const fileUrl = `${config.api_endpoint}${fileMeta.VersionData}`;
    const fileRes = await axios.get(fileUrl, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
      },
      responseType: "arraybuffer",
    });
    const FileName = `${fileMeta.Title}.${fileMeta.FileExtension}`;

    event.node.res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(FileName)}"`
    );
    event.node.res.setHeader("Content-Type", fileRes.headers["content-type"]);
  
    event.node.res.end(fileRes.data);

  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response
        ? error.response.data.error_description || JSON.stringify(error.response.data)
        : error.message,
    });
  }
});
