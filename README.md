# What is StreamChain?
While we don’t want a centralized organization controlling crucial video evidence of things like police brutality or war crimes, safety and legality must be paramount. Combining the decentralized and immutable nature of Walrus Blob Storage with the safety and versatility of multi-modal LLM content moderation, we can ensure that videos that need to be published can be seen, while also moderating content that users upload, simultaneously ensuring the legality of the uploaded content.
# Use of Walrus
Walrus Blob Storage is leveraged for its decentralized and immutable nature. The frontend procures blobIDs directly from the SKALE blockchain, and fetches the video directly from Walrus. Before any content is pushed to Walrus, the content moderation must make a decision as to its visibility and legality.

# How does it work?
Using the SKALE blockchain, the content moderation model is fully auditable, as every confirmation or rejection is pushed to the chain with a reason provided by the model. Even the weights of the model are published on Walrus, meaning anybody can investigate the nature of the model and object to its behavior.

The video content moderation system uses an advanced filtering technique that can moderate huge amounts of footage with little inference cost. First, the frames are embedded in a multi-modal vector space using OpenAI CLIP. This process runs super fast entirely on device using Mac M2 Metal Performance Shaders. We can run this inexpensive computation in huge volume for free, which makes it perfect for filtering out potential true positives. We can then forward the frame to a smarter model, such as GPT-4o, for a final decision on content moderation.

This method of content moderation is completely zero shot and is therefore extremely versatile. It can be further tuned with either fine-tuning or prompt adjustments, which can increase accuracy and usability.
