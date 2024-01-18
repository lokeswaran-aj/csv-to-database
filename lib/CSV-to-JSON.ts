"use server";
import OpenAI from "openai";

const getJsonData = async (dataStructure: string, csvString: string) => {
    try {
        const apiKey = process.env["OPENAI_API_KEY"];
        const openai = new OpenAI({ apiKey: apiKey });
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "user",
                    content:
                        "You are a csv to JSON covering expert. The inputs are a CSV data and a data structure. You have to return the JSON representation of the csv in a JSON format",
                },
                {
                    role: "user",
                    content:
                        "You have 4 rules. Rule-1: duplicate() should create duplicate rows for each source column's value in the CSV. Rule-2: concatenate() method should concatenate the source column values in the CSV. Rule-3: source() method should only use the given column to populate in the csv. Rule-4: DO NOT omit any data for brevity or do not finish the reason until token limit is exceeded. Send the full JSON in single response.",
                },
                {
                    role: "user",
                    content: `Here is your data structure: ${dataStructure}`,
                },
                {
                    role: "user",
                    content: `Here is your CSV data: ${csvString}`,
                },
            ],
        });
        console.log("Usage:", completion.usage);
        console.log("Finish reason:", completion.choices[0].finish_reason);
        console.log("Response:", completion.choices[0].message.content);
        if (!completion.choices[0].message.content)
            throw new Error("Response is empty");
        let response = completion.choices[0].message.content;

        const jsonResponse = JSON.parse(response);
        return Object.values(jsonResponse)[0];
    } catch (error: any) {
        throw new Error("Failed to process CSV data. Please try again.");
    }
};

export default getJsonData;
