const items = [
  "Open to frontend & full-stack roles",
  "React · TypeScript · FastAPI",
  "Hyderabad · Remote",
  "Immediate joiner",
];

/**
 * Slim announcement ticker before Contact, like a store's "sale" strip. The "marquee" scene loops it and
 * ties its speed and direction to the scroll; without GSAP it sits still. Screen readers get one sentence.
 */
export function Marquee() {
  return (
    <div className="mq" data-scene="marquee">
      <p className="sr-only">
        Open to frontend and full-stack developer roles, in Hyderabad or remote, and able to join immediately.
      </p>
      <div className="mq-row" aria-hidden="true">
        <div className="mq-track">
          {/* two identical sets, each repeated so one set is wider than any screen: a -50% loop is seamless */}
          {[0, 1].map((copy) => (
            <span key={copy} className="mq-set">
              {[...items, ...items, ...items].map((text, i) => (
                <span key={i} className="mq-item">
                  {text}
                  <i className="mq-star">✦</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
