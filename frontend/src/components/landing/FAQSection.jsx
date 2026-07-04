// FAQ section — purely a data list rendered through the reusable
// Accordion component. Add/remove questions here without touching
// any markup.

import SectionHeading from "../ui/SectionHeading";
import Accordion from "../ui/Accordion";

const FAQ_ITEMS = [
  {
    question: "What file formats does Resumly accept?",
    answer: "PDF and DOCX are both supported. We extract and analyze the text content directly from the file.",
  },
  {
    question: "Do I need to create an account to try it?",
    answer: "No — your first scan is free and doesn't require signup. An account is only needed to save your history or use Pro features.",
  },
  {
    question: "How is this different from a generic ATS checker?",
    answer:
      "Most ATS checkers give the same static advice to everyone. Resumly uses retrieval-augmented generation to ground every suggestion in the specific text of your resume and the job description you provide.",
  },
  {
    question: "Is my resume data stored or shared?",
    answer:
      "Your resume is processed to generate your report and is not shared with third parties. You can delete your stored data at any time from your account settings.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer: "Yes, subscriptions are month-to-month with no lock-in — cancel anytime from your billing settings.",
  },
];

function FAQSection() {
  return (
    <section id="faq" className="border-y border-line bg-surface/40 px-6 py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-14">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="w-full">
          <Accordion items={FAQ_ITEMS} />
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
