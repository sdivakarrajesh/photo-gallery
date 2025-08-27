import {
    Florence2ForConditionalGeneration,
    AutoProcessor,
    load_image,
    pipeline,
} from "@huggingface/transformers";

export default class AIService {
    async _prompt(photo_data: string, task: string): Promise<string> {
        console.log("Loading model");
        const model_id = "onnx-community/Florence-2-base-ft";
        const model = await Florence2ForConditionalGeneration.from_pretrained(
            model_id,
            { dtype: "q4" }
        ); // q4 - 1GB, fp16 - 4GB
        const processor = await AutoProcessor.from_pretrained(model_id);

        // Load image and prepare vision inputs
        const image = await load_image(photo_data);
        console.log("Loaded image..");
        // Specify task and prepare text inputs
        //@ts-ignore
        const prompts = processor.construct_prompts(task);

        // Pre-process the image and text inputs
        console.log("Processing image..");
        const inputs = await processor(image, prompts);

        // Generate text
        console.log("Generating response..");
        const generated_ids = await model.generate({
            ...inputs,
            max_new_tokens: 100,
        });

        // Decode generated text
        //@ts-ignore
        const generated_text = processor.batch_decode(generated_ids, {
            skip_special_tokens: false,
        })[0];

        // Post-process the generated text
        //@ts-ignore
        const result = processor.post_process_generation(
            generated_text,
            task,
            image.size
        );
        console.log("PII result", result);
        return Object.values(result)[0] as string;
    }

    async hasPII(photo_data: string) {
        const task = 'Does this image have PII? Say "yes" or "no"';
        const result = await this._prompt(photo_data, task);
        return result.includes("yes");
    }

    async extractKeywords(photo_data: string) {
        const task = "Describe the image in a few comma separated keywords";
        const result = await this._prompt(photo_data, task);
        return result.split(", ");
    }

    async generateVector(photo_data: string) {
        const image_feature_extractor = await pipeline(
            "image-feature-extraction",
            "Xenova/dinov2-small"
        );
        const url = photo_data;
        const features = await image_feature_extractor(url);
        console.log(features);
        return features.ort_tensor.data as [];
    }

    async getBlurredImage(photo_data: string): Promise<string> {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = photo_data;
            img.onload = () => {
                // Create a canvas dynamically
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx!.filter = "blur(40px)";
                ctx!.drawImage(img, 0, 0);
                document.body.appendChild(canvas);
                const blurredBase64 = canvas.toDataURL("image/png");
                console.log("Blurred Base64:", blurredBase64);
                resolve(blurredBase64);
            };
        });
    }
}
