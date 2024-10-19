import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
from typing import List, Union, Dict

class ClipModel:
    def __init__(self):      
        # Set device to MPS if available, else GPU if available, else CPU
        if torch.backends.mps.is_available():
            self.device = torch.device("mps")
        elif torch.cuda.is_available():
            self.device = torch.device("cuda")
        else:
            self.device = torch.device("cpu")
        print(f"Using device: {self.device}")

        # Load the CLIP model and processor
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    def classify_image(self, image: Union[str, Image.Image], class_labels: List[str]) -> Dict[str, float]:
        """
        Classify an image into one of the provided class labels.

        Args:
            image (str or PIL.Image.Image): Path to the image file or PIL Image object.
            class_labels (List[str]): A list of class labels to classify the image into.

        Returns:
            Dict[str, float]: A dictionary mapping class labels to their probabilities.
        """
        # If image is a path, open it
        if isinstance(image, str):
            image = Image.open(image).convert("RGB")

        # Prepare inputs
        inputs = self.processor(text=class_labels, images=image, return_tensors="pt", padding=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        # Perform inference
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image  # Image-text similarity scores
            probs = logits_per_image.softmax(dim=1)      # Convert logits to probabilities

        # Map class labels to probabilities
        probs = probs.cpu().numpy().flatten()
        result = dict(zip(class_labels, probs))

        return result
