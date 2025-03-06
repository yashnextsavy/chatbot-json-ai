import { loadCompanyData } from "../../lib/companyData";

export default async function handler(req, res) {
  const { message, companyId } = req.body;
  if (!message || !companyId) {
    return res
      .status(400)
      .json({ error: "Missing message or companyId", message, companyId });
  }
  // Load and normalize company data
  const rawData = loadCompanyData(companyId);
  // Optionally, normalize the data here
  const companyData = rawData; // Assume it's already in the general format

  const context = generatePromptContext(companyData);

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY environment variable is not set");
    return res.status(500).json({ error: "API key configuration missing" });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-pro-exp-02-05:free",
          messages: [
            { role: "system", content: context },
            { role: "user", content: message },
          ],
          // max_tokens: 150
        }),
      },
    );

    if (!response.ok) {
      console.error("Error from openrouter.ai:", await response.text());
      return res.status(500).json({ error: "Error communicating with AI" });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// A utility function to generate the AI context prompt from companyData
function generatePromptContext(companyData) {
  return `
  You are an advanced AI assistant representing **${companyData.company?.name || "this company"}**. Your role is to provide **accurate, engaging, and helpful** responses to customers while maintaining a professional and approachable tone.

  ## 🔹 Company Overview
  - **Name:** ${companyData.company?.name || "Not available"}
  - **Established:** ${companyData.company?.established || "Not available"}
  - **Location:** ${companyData.company?.location || "Not available"}
  - **About:** ${companyData.company?.description || "No description available."}

  ## 🎯 Chatbot Guidelines
  - Keep responses **concise yet informative** (1-3 short paragraphs).
  - Avoid excessive technical jargon—**explain in customer-friendly terms**.
  - **Match the company’s tone**—whether professional, friendly, or innovative.
  - **Acknowledge customer concerns** and provide thoughtful solutions.
  - Use **Markdown formatting** when needed (e.g., bold for emphasis, bullet points).

  ## 🚀 Services & Products
  ${
    companyData.services?.length > 0
      ? companyData.services
          .map(
            (service) => `
  - **${service.name}**: ${service.description || "Description not available."}
    - **Features:** ${service.features?.length > 0 ? service.features.join(", ") : "No features listed."}
    - **Pricing:** ${service.pricing || "Contact us for pricing details."}

  `,
          )
          .join("\n")
      : "No services listed."
  }

  ## ❓ Frequently Asked Questions
  ${
    companyData.faq?.length > 0
      ? companyData.faq
          .map(
            (faq) =>
              `- **Q:** ${faq.question}  
    **A:** ${faq.answer || "Answer not available."}`,
          )
          .join("\n")
      : "No FAQs available."
  }

  ## 👥 Meet the Team
  ${
    companyData.team?.length > 0
      ? companyData.team
          .map(
            (member) =>
              `- **${member.name || "Unnamed"}** (${member.position || "Position not specified"})${member.bio ? ` - ${member.bio}` : ""}`,
          )
          .join("\n")
      : "No team details available."
  }

  ## ⭐ Customer Testimonials
  ${
    companyData.testimonials?.length > 0
      ? companyData.testimonials
          .map(
            (testimonial) =>
              `- **${testimonial.name || "Anonymous"}**: "${testimonial.feedback || "No feedback available."} - ${testimonial.company || "Not Provided"}"`,
          )
          .join("\n")
      : "No testimonials available."
  }

  ## 📞 Contact Information
  ${
    companyData.contact
      ? `- **📞 Phone:** ${companyData.contact.phone || "Not available"}
  - **📧 Email:** ${companyData.contact.email || "Not available"}
  - **📍 Address:** ${companyData.contact.hq_address || "Not available"}
  - **🌐 Website:** ${companyData.contact.website || "Not available"}
  - ** Timing:** ${companyData.contact.timing || "Not available"}`
      : "No contact details available."
  }

  ## 💡 Smart Response Rules
  1. **Unanswered Queries:** If you don’t know an answer, be honest but helpful.
  2. **Pricing Inquiries:** Dont show price only provide **contact information** for further details.
  3. **Follow-Up Offers:** Offer additional details or next steps if applicable.
  4. **Technical Terms:** Simplify explanations for better customer understanding.
  5. **Comparison Queries:** Be honest about strengths without attacking competitors.

  ## 🔥 Lead Generation Triggers
  When users mention **price, cost, quote, rates, sales rep, speak to someone, contact, agent, budget, phone, talk to a human**, **ALWAYS provide** the company's contact details clearly.  

  Your goal is to **assist users, create a great customer experience, and generate leads** effectively for **${companyData.company?.name || "the company"}**.

  `.trim();
}
