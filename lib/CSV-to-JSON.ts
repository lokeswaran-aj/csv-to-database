import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getJsonData = async (dataStructure: any, csvString: string) => {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "You are a csv to JSON covering expert. The inputs are a CSV data and a data structure. You have to generate a one-line JSON with '```json```'. Rules: 1. concatenate() method should concatenate the source column values in the CSV.2. duplicate() should create duplicate rows for each source column's value in the CSV",
            },
            {
                role: "system",
                content:
                    "You have 3 rules. Rule-1: duplicate() should create duplicate rows for each source column's value in the CSV. Rules-2: concatenate() method should concatenate the source column values in the CSV.",
            },
            {
                role: "user",
                content: `Here is the data structure: ${dataStructure}`,
            },
            {
                role: "user",
                content: `Here is the CSV data: ${csvString}`,
            },
        ],
    });
    console.log("====================================");
    console.log("Response:", response.choices[0].message);
    console.log("====================================");
};

export default getJsonData;
