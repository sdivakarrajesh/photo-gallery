import {
    Florence2ForConditionalGeneration,
    AutoProcessor,
    load_image,
    RawImage,
    AutoTokenizer,
    CLIPTextModelWithProjection,
    CLIPVisionModelWithProjection,
    dot,
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
        console.log("VLM result", result);
        return Object.values(result)[0] as string;
    }

    async hasPII(photo_data: string) {
        // const task = 'Does this image have PII like passport, driving license, credit card, etc? Say "yes" or "no" followed by the reason';
        const task = `Carefully examine the image.  
Answer "yes" only if the image clearly shows personally identifiable documents (e.g., passport, ID card, driving license, credit card).  
If the image shows unrelated content (like food, landscapes, animals, or objects), answer "no" and explain that it is not PII.
Do not guess — if you are not certain, answer "no"`
        const result = await this._prompt(photo_data, task);
        return result.includes("yes");
    }

    async extractKeywords(photo_data: string) {
        const task = "Describe the image in a few comma separated keywords";
        const result = await this._prompt(photo_data, task);
        return result.split(", ");
    }

    async generateImageVector(photo_data: string) {
        const model_id = 'Xenova/mobileclip_s2';
        const processor = await AutoProcessor.from_pretrained(model_id);
        const vision_model = await CLIPVisionModelWithProjection.from_pretrained(model_id);
        const image = await RawImage.read(photo_data);
        const image_inputs = await processor(image);
        const { image_embeds } = await vision_model(image_inputs);
        const normalized_image_embeds = image_embeds.normalize().tolist();
        return normalized_image_embeds[0];
    }

    async generateVector(description: string) {
        const model_id = 'Xenova/mobileclip_s2';
        const tokenizer = await AutoTokenizer.from_pretrained(model_id);
        const text_model = await CLIPTextModelWithProjection.from_pretrained(model_id);
        const text_inputs = tokenizer(description, { padding: 'max_length', truncation: true });
        const { text_embeds } = await text_model(text_inputs);
        const normalized_text_embeds = text_embeds.normalize().tolist();
        return normalized_text_embeds[0];
    }

    async computeSimilarity(v1: any, v2: any) {
        console.log("Computing similarity", v1, v2)
        return dot(v1, v2)
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
