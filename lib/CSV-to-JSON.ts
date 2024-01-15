"use server";
import { throws } from "assert";
import OpenAI from "openai";

const getJsonData = async (dataStructure: string, csvString: string) => {
    const apiKey = process.env["OPENAI_API_KEY"];

    const openai = new OpenAI({ apiKey: apiKey });
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "You are a csv to JSON covering expert. The inputs are a CSV data and a data structure. You have to generate a JSON from the csv within ```json```. Rules: 1. concatenate() method should concatenate the source column values in the CSV.2. duplicate() should create duplicate rows for each source column's value in the CSV",
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
    console.log("Response:", response.choices[0].message.content);
    let regex = /```json\s*([\s\S]+?)\s*```/;

    let match = response.choices[0].message.content?.match(regex);
    if (!match) regex = /```\s*([\s\S]+?)\s*```/;
    match = response.choices[0].message.content?.match(regex);

    if (match) {
        const jsonString = match[1];

        try {
            return JSON.parse(jsonString);
        } catch (error: any) {
            console.error("Error parsing JSON:", error.message);
        }
    } else {
        throw new Error(
            "Proper response was not returned from OpenAI. Retry by uploading again."
        );
    }
};

export default getJsonData;
