import Montage from './montage';
import { Countdown, Gallery, RSVP, Navigation } from './interactions';
import { optionalDetails } from './wedding-config';
const maps = (place: string) =>
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(place);
export default function Home() {
  return (
    <main id="home">
      <Navigation />
      <section className="hero">
        <img
          className="hero-photo"
          src="/photos/6.jpg"
          alt="Brandon embracing Lourey Mae beneath a tree, with a mountain in the distance"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">A new chapter, together</p>
          <h1>
            Brandon<span>&</span>Lourey Mae
          </h1>
          <p className="hero-date">SEPTEMBER 09, 2026</p>
          <p className="script">For all the days to come.</p>
        </div>
        <div className="hero-bottom">
          <span>MANDALUYONG · MAKATI</span>
          <a href="#invitation">OUR WEDDING CELEBRATION ↓</a>
        </div>
      </section>
      <section className="invitation section" id="invitation">
        <p className="eyebrow">With full hearts & our favorite people</p>
        <h2>You are invited</h2>
        <p className="intro">
          Some days change everything.
          <br />
          We would love for you to be part of ours.
        </p>
        <p className="full-names">
          Brandon Macalos Giluano<span>&</span>Lourey Mae Castillo Apal
        </p>
        <div className="date-stamp">
          <span>WEDNESDAY</span>
          <strong>
            09 <i>·</i> 09 <i>·</i> 2026
          </strong>
          <span>THE BEGINNING OF FOREVER</span>
        </div>
        <Countdown />
        <div className="actions">
          <a className="button" href="#rsvp">
            Kindly RSVP
          </a>
          <a className="text-link" href="/wedding.ics" download>
            Add to calendar ↗
          </a>
        </div>
      </section>
      <section className="story section story-montage"><Montage /><div className="story-video-shade" aria-hidden="true" />
        <div className="story-copy">
          <p className="eyebrow">The little things. The big adventure.</p>
          <h2>
            A lifetime of
            <br />
            <em>you & me.</em>
          </h2>
          <p>
            Hand in hand, from everyday moments to new adventures. Now, the next
            chapter begins.
          </p>
          <p>
            We can’t wait to share this day with the people who mean the most to
            us.
          </p>
          <span className="script">Brandon & Lourey</span>
        </div>
      </section>

      <section id="venue" className="section venues">
        <p className="eyebrow">Meet us here</p>
        <h2>Two places. One special day.</h2>
        <div className="venue-grid">
          <article>
            <span className="number">01</span>
            <h3>Ceremony</h3>
            <p className="venue-time">10:00 AM</p>
            <p className="venue-name">
              Mandaluyong City
              <br />
              RTC 210
            </p>
            <p>
              September 9, 2026
              <br />
              Mandaluyong City
            </p>
            <a
              target="_blank"
              rel="noreferrer"
              className="text-link"
              href={maps('Mandaluyong City RTC Branch 210')}
            >
              Driving directions ↗
            </a>
          </article>
          <div className="venue-photo">
            <img
              src="/photos/13.jpg"
              alt="Brandon and Lourey Mae embracing beneath a tree"
              loading="lazy"
            />
          </div>
          <article>
            <span className="number">02</span>
            <h3>Reception</h3>
            <p className="venue-time">1:00 PM</p>
            <p className="venue-name">Circles Event Cafe</p>
            <p>
              Makati Shangri-La, Manila
              <br />
              Makati City
            </p>
            <a
              target="_blank"
              rel="noreferrer"
              className="text-link"
              href={maps('Circles Event Cafe Makati Shangri-La Manila')}
            >
              Driving directions ↗
            </a>
          </article>
        </div>
      </section>
      <section className="timeline" id="timeline">
        <img
          src="/photos/12.jpg"
          alt="The couple walking hand in hand through the city at night"
          loading="lazy"
        />
        <div className="timeline-shade" />
        <div className="timeline-copy">
          <p className="eyebrow">Let the day unfold</p>
          <h2>
            Our wedding
            <br />
            <span className="script">Wednesday</span>
          </h2>
          <div className="timeline-item">
            <time>10:00 AM</time>
            <div>
              <h3>We say “I do”</h3>
              <p>The ceremony · Mandaluyong City RTC 210</p>
            </div>
          </div>
          <div className="timeline-item">
            <time>1:00 PM</time>
            <div>
              <h3>We celebrate</h3>
              <p>The reception · Circles Event Cafe</p>
            </div>
          </div>
          <p className="tiny">September 9, 2026 · Philippine Standard Time</p>
        </div>
      </section>
      <section className="section attire" id="attire">
        <div className="attire-title">
          <p className="eyebrow">A little elegance, a little romance</p>
          <h2>
            Dressed for
            <br />
            the occasion
          </h2>
          <span className="script">Semi-formal</span>
        </div>
        <div className="attire-info">
          <p>
            Soft hues and timeless details, inspired by the romance of
            Bridgerton. Let our wedding palette inspire your look.
          </p>
          <div className="swatches">
            {[
              ['Ivory', '#eee7db'],
              ['Dusty blue', '#9dB0b5'],
              ['Blush', '#c9a6a0'],
              ['Soft gold', '#b4a07a'],
            ].map(([label, color]) => (
              <div key={label}>
                <span style={{ background: color }} />
                <small>{label}</small>
              </div>
            ))}
          </div>
          <p className="tiny">
            Think flowing dresses, tailored separates, and comfortable dress
            shoes.
          </p>
        </div>
      </section>
      <section className="section gallery" id="gallery">
        <p className="eyebrow">A few of our favorite memories</p>
        <h2>Us, along the way.</h2>
        <p className="gallery-caption">Little moments we’ll keep forever.</p>
        <Gallery />
      </section>
      <section className="section details-section" id="faq">
        <div className="details-title">
          <p className="eyebrow">A few things to know</p>
          <h2>
            With love,
            <br />
            the details.
          </h2>
          <img
            src="/photos/9.jpg"
            alt="A kiss on the cheek among blue flowers"
            loading="lazy"
          />
        </div>
        <div className="details-content">
          <h3>Questions & answers</h3>
          {[
            [
              'What should I wear?',
              'Our dress code is semi-formal. The palette above is your inspiration: ivory, dusty blue, blush, and soft gold.',
            ],
            [
              'Where are the ceremony and reception?',
              'The ceremony is at Mandaluyong City RTC 210 at 10 AM. The reception follows at Circles Event Cafe, Makati Shangri-La, Manila at 1 PM.',
            ],
            [
              'Is parking available?',
              'Please check parking options directly with your venue before traveling. The directions links above can help you plan your route.',
            ],
            ...Object.entries(optionalDetails)
              .filter(([key, value]) => key !== 'gifts' && Boolean(value))
              .map(([key, value]) => [
                key === 'plusOnes'
                  ? 'May I bring a plus-one?'
                  : 'May I bring children?',
                value,
              ]),
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
          {optionalDetails.gifts && (
            <div className="note" id="gifts">
              <p className="eyebrow">Gifts</p>
              <p>{optionalDetails.gifts}</p>
            </div>
          )}
          <div className="note" id="reminders">
            <p className="eyebrow">A gentle reminder</p>
            <p>
              Please allow time for travel between Mandaluyong and Makati, and
              plan to arrive before the ceremony begins. Keep your invitation
              handy and check your route before leaving.
            </p>
          </div>
          <div className="song" id="music">
            <span>♫</span>
            <div>
              <p className="eyebrow">The soundtrack to our story</p>
              <h3>
                blue <small>— yung kai</small>
              </h3>
              <p className="tiny">The soundtrack to our new beginning.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-photo">
          <img
            src="/photos/1.jpg"
            alt="Brandon and Lourey Mae sitting together beside a field of blue flowers"
            loading="lazy"
          />
          <span className="script">Save a moment for us.</span>
        </div>
        <div className="rsvp-copy">
          <p className="eyebrow">We saved you a place in our day</p>
          <h2>See you there?</h2>
          <p>We’d love to celebrate with you.</p>
          <RSVP />
        </div>
      </section>
      <footer>
        <a className="monogram" href="#home">
          B<span>&</span>L
        </a>
        <p>BRANDON & LOUREY MAE</p>
        <span>09.09.2026 · With love, always.</span>
        <a href="#home">Back to the beginning ↑</a>
      </footer>
    </main>
  );
}


