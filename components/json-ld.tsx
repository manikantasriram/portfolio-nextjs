import { education, skillGroups } from "@/lib/content";
import { site } from "@/lib/site";

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

/** Person + ProfilePage + WebSite structured data, built only from facts shown on the page. */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        givenName: site.firstName,
        familyName: site.lastName,
        url: `${site.url}/`,
        image: `${site.url}${site.photo}`,
        email: `mailto:${site.email}`,
        jobTitle: site.jobTitle,
        description:
          "Full stack developer in Hyderabad, India building React and TypeScript interfaces with Python, FastAPI and PostgreSQL backends.",
        address: {
          "@type": "PostalAddress",
          addressLocality: site.locality,
          addressCountry: site.country,
        },
        knowsAbout: [
          ...new Set(skillGroups.slice(0, 3).flatMap((g) => g.skills.map((s) => s.name))),
        ],
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: education.school,
          address: { "@type": "PostalAddress", addressLocality: "Tadepalligudem", addressCountry: "IN" },
        },
        sameAs: [site.github, site.linkedin],
      },
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profile`,
        url: `${site.url}/`,
        name: site.title,
        description: site.description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        about: { "@id": personId },
        primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}${site.ogImage}` },
        dateModified: new Date().toISOString().slice(0, 10),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${site.url}/`,
        name: site.name,
        alternateName: "Manikanta Sriram Portfolio",
        inLanguage: "en",
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
