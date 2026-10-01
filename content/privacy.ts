// Privacy policy draft for this website. Not legal advice: the page is labelled
// "Draft pending legal review" in the UI. Describes what the site actually does:
// mailto forms, a cart kept in the browser (localStorage), email order requests,
// no online payments and no analytics or tracking cookies.

export type PrivacyContent = {
  updated: string;
  intro: string;
  sections: { title: string; body: string[] }[];
};

export const PRIVACY: PrivacyContent = {
  updated: "1 October 2026",
  intro:
    "This policy explains what information this website handles, why, and the choices you have. We have kept it short because the site itself collects very little. Where you choose to email us, we use what you send only to help you.",

  sections: [
    {
      title: "Who we are.",
      body: [
        "This website is run by ProteGo Hygiene Pvt. Ltd., K-104, Tower 6, International Infotech Park, Vashi, Navi Mumbai 400 705, India. In this policy, \"we\" and \"us\" mean ProteGo Hygiene Pvt. Ltd.",
        "For any question about this policy or your information, write to sales@protegohygiene.com.",
      ],
    },
    {
      title: "What this website collects.",
      body: [
        "You can browse this website without creating an account or telling us who you are. We do not run analytics, advertising or tracking cookies, and we do not build profiles of visitors.",
        "Like most websites, the service that hosts this site may automatically record basic technical details when a page is requested, such as your IP address, browser type and the time of the request. These records are kept to keep the site secure and working, not to identify or follow individual visitors.",
      ],
    },
    {
      title: "Contact and assessment forms.",
      body: [
        "Our contact and assessment forms do not send anything to us directly. When you press the button, the form opens your own email app with a message already written from the details you entered.",
        "Nothing reaches us unless you choose to send that email. The website does not store what you type into these forms.",
        "Once you send the email, we receive it like any other message, together with your email address and whatever details you included, such as your name, phone number, organisation and the space you want assessed.",
      ],
    },
    {
      title: "Your cart and order requests.",
      body: [
        "If you add products to the cart, the cart is saved only in your own browser, using a feature called local storage. It stays on your device, we cannot see it, and it is not a cookie. You can clear it by emptying the cart or clearing this site's data in your browser.",
        "When you place an order request, the checkout opens your email app with the order details and the contact and delivery details you entered. As with the forms, nothing reaches us until you send that email.",
        "We do not take payments on this website. After we receive an order request, we will contact you to confirm availability, price, delivery and how to pay.",
      ],
    },
    {
      title: "How we use what you send us.",
      body: [
        "We use the information in your emails to reply to you, prepare quotes, arrange assessments, visits and deliveries, and keep the records we need for orders, accounts and our legal obligations.",
        "For Hospital to Home™, we ask for a patient's or family's details only with their consent and use them only to arrange and carry out the home visit and share its report.",
        "We do not sell your information. We share it only where needed to do what you asked, for example with a courier delivering your order, or where the law requires us to.",
        "Your emails are handled by your own email provider and ours on the way to us. Email is widely used but not perfectly secure, so please avoid sending sensitive details unless they are needed.",
      ],
    },
    {
      title: "How long we keep it.",
      body: [
        "We keep your information only for as long as we need it for the purpose you shared it for, or for as long as the law requires us to keep records, such as tax and accounting records. After that, we delete it.",
      ],
    },
    {
      title: "Your rights.",
      body: [
        "Under India's Digital Personal Data Protection Act, 2023, you can ask us for a summary of the personal information we hold about you and how we use it, ask us to correct, complete or update it, and ask us to erase it where we no longer need to keep it. Where we rely on your consent, you can withdraw it at any time.",
        "To make a request or raise a concern, email sales@protegohygiene.com with \"Privacy request\" in the subject line. We may need to confirm your identity before acting on a request, and we will reply as soon as we reasonably can.",
        "If you are not satisfied with our response, you can contact the Data Protection Board of India.",
      ],
    },
    {
      title: "Changes to this policy.",
      body: [
        "We will update this policy if the website changes how it handles information. If we ever add analytics or similar tools, we will update this policy before they go live and ask for your consent where that is required.",
        "The date at the top of this page shows when the policy was last updated.",
      ],
    },
  ],
};
