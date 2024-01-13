import InputFile from "@/components/FileUploader";

export default function Home() {
    return (
        <main className="mx-auto my-12 w-full max-w-4xl">
            <div className="text-xl font-bold">CSV To Database Converter</div>
            <div className="my-4">
                <InputFile />
            </div>
        </main>
    );
}
