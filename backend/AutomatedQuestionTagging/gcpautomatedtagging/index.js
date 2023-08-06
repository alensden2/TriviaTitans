const functions = require('@google-cloud/functions-framework');
const { LanguageServiceClient } = require('@google-cloud/language');

functions.http('helloHttp', async (req, res) => {
  try {
    const { text } = req.body;
    console.log({ text });

    // Initialize the LanguageServiceClient
    const languageClient = new LanguageServiceClient();

    // Classify text into categories using the Natural Language API
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };

    const [result] = await languageClient.classifyText({ document });
    const categories = result.categories;

    // Find the most relevant category with highest confidence score
    let category = '';
    let maxConfidence = 0;

    categories.forEach((cat) => {
      if (cat.confidence > maxConfidence) {
        category = cat.name;
        maxConfidence = cat.confidence;
      }
    });

    return res.status(200).json({ category });
  } catch (error) {
    console.error('Error classifying text:', error);
    return res.status(500).json({ error: 'Error classifying text.' });
  }
});
