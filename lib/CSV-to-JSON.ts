"use server";
import OpenAI from "openai";

const getJsonData = async (dataStructure: string, csvString: string) => {
    const apiKey = process.env["OPENAI_API_KEY"];

    const openai = new OpenAI({ apiKey: apiKey });
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "You are a csv to JSON covering expert. The inputs are a CSV data and a data structure. You have to return the JSON representation of the csv within ```json``` string.",
            },
            {
                role: "system",
                content:
                    "You have 2 rules. Rule-1: duplicate() should create duplicate rows for each source column's value in the CSV. Rules-2: concatenate() method should concatenate the source column values in the CSV.",
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
    console.log("Response:", completion.choices[0].message.content);
    if (!completion.choices[0].message.content) return "";
    const response = completion.choices[0].message.content;

    let matchFound =
        response.match(/```json\s*([\s\S]+?)\s*```/) ||
        response.match(/```\s*([\s\S]+?)\s*```/) ||
        response.match(/"data":\s*(\[[\s\S]*?\])/);
    if (matchFound) return JSON.parse(matchFound[1]);

    const jsonObjectRegex = /{[^{}]*}/g;

    let match;
    const jsonArray = [];

    while ((match = jsonObjectRegex.exec(response)) !== null) {
        jsonArray.push(JSON.parse(match[0]));
    }
    return jsonArray;
};

export default getJsonData;
