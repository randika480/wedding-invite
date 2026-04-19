import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Decorative SVG Components ───────────────────────────────────────────────

const FloralCorner = ({ style }) => (
  <svg
    viewBox="0 0 80 80"
    style={{ width: 64, height: 64, opacity: 0.35, ...style }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 75 Q40 5 75 5" stroke="#b5804a" strokeWidth="1.5" fill="none" />
    <path d="M5 60 Q30 30 60 5" stroke="#b5804a" strokeWidth="1" fill="none" />
    <circle cx="10" cy="70" r="4" fill="#d4a96a" />
    <circle cx="20" cy="55" r="3" fill="#c49058" />
    <circle cx="35" cy="38" r="4" fill="#d4a96a" />
    <circle cx="55" cy="22" r="3" fill="#c49058" />
    <circle cx="68" cy="10" r="4" fill="#d4a96a" />
    <path
      d="M10 70 Q14 64 10 62 Q6 64 10 70Z"
      fill="#b5804a"
      opacity="0.6"
    />
    <path
      d="M35 38 Q41 32 37 28 Q31 30 35 38Z"
      fill="#b5804a"
      opacity="0.6"
    />
  </svg>
);

const Divider = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: "20px auto",
      maxWidth: 280,
    }}
  >
    <div style={{ flex: 1, height: 1, background: "#d4a96a", opacity: 0.5 }} />
    <svg
      viewBox="0 0 24 24"
      style={{ width: 18, height: 18, flexShrink: 0 }}
      fill="#b5804a"
    >
      <path d="M12 2C9.8 4.2 8 6.8 8 9a4 4 0 008 0c0-2.2-1.8-4.8-4-7z" />
      <path d="M7 11C4.8 11 3 12.8 3 15s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" opacity="0.6" />
      <path d="M17 11c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" opacity="0.6" />
    </svg>
    <div style={{ flex: 1, height: 1, background: "#d4a96a", opacity: 0.5 }} />
  </div>
);

const Ring = () => (
  <svg
    viewBox="0 0 48 24"
    style={{ width: 64, height: 32 }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="12" r="10" stroke="#b5804a" strokeWidth="2" fill="none" />
    <circle cx="32" cy="12" r="10" stroke="#b5804a" strokeWidth="2" fill="none" />
    <circle cx="16" cy="12" r="7" stroke="#d4a96a" strokeWidth="0.8" fill="none" opacity="0.5" />
    <circle cx="32" cy="12" r="7" stroke="#d4a96a" strokeWidth="0.8" fill="none" opacity="0.5" />
    <circle cx="16" cy="7" r="2" fill="#d4a96a" />
    <circle cx="32" cy="7" r="2" fill="#d4a96a" />
  </svg>
);

// ─── Envelope Component ───────────────────────────────────────────────────────

const Envelope = ({ onOpen }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a0a00 0%, #2e1408 40%, #1a0a00 100%)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture dots */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#d4a96a",
            opacity: 0.15 + Math.random() * 0.2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          color: "#d4a96a",
          letterSpacing: "0.25em",
          fontSize: 11,
          textTransform: "uppercase",
          marginBottom: 40,
          fontFamily: "Georgia, serif",
        }}
      >
        You are cordially invited
      </motion.p>

      {/* Envelope */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        onClick={onOpen}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        style={{
          cursor: "pointer",
          position: "relative",
          userSelect: "none",
        }}
      >
        {/* Envelope body */}
        <motion.div
          animate={{ y: hover ? -6 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            width: "min(340px, 88vw)",
            height: "min(220px, 56vw)",
            background: "#f5efe6",
            borderRadius: 4,
            position: "relative",
            boxShadow: hover
              ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px #b5804a44"
              : "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px #b5804a22",
            transition: "box-shadow 0.3s",
          }}
        >
          {/* Envelope flap (top triangle) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "200%",
                background: "#ede4d8",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                borderBottom: "1px solid #c9a87833",
              }}
            />
          </div>

          {/* Left flap line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "50%",
              height: "50%",
              borderRight: "1px solid #c9a87833",
              background: "#f0e9e0",
              clipPath: "polygon(0 100%, 100% 0, 0 0)",
            }}
          />
          {/* Right flap line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "50%",
              height: "50%",
              borderLeft: "1px solid #c9a87833",
              background: "#ece5dc",
              clipPath: "polygon(100% 100%, 0 0, 100% 0)",
            }}
          />

          {/* Wax seal */}
          <motion.div
            animate={{ scale: hover ? 1.08 : 1, rotate: hover ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 68,
              height: 68,
              background: "radial-gradient(circle at 35% 35%, #7a3012, #4a1a06)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(74,26,6,0.6)",
              border: "2px solid #9e4820",
              zIndex: 10,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <svg viewBox="0 0 28 20" style={{ width: 28, height: 20 }} fill="none">
              <path
                d="M14 2 Q16 8 22 8 Q16 8 14 14 Q12 8 6 8 Q12 8 14 2Z"
                fill="#d4a96a"
                opacity="0.9"
              />
            </svg>
            <div
              style={{
                fontSize: 8,
                color: "#d4a96a",
                letterSpacing: "0.1em",
                fontFamily: "Georgia, serif",
                opacity: 0.8,
              }}
            >
              A&V
            </div>
          </motion.div>

          {/* Gold border on envelope */}
          <div
            style={{
              position: "absolute",
              inset: 8,
              border: "1px solid #b5804a44",
              borderRadius: 2,
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          color: "#b5804a",
          fontSize: 13,
          marginTop: 32,
          letterSpacing: "0.15em",
          fontFamily: "Georgia, serif",
        }}
      >
        tap to open
      </motion.p>
    </div>
  );
};

// ─── Invitation Card Component ────────────────────────────────────────────────

const InvitationCard = () => {
  const cardStyle = {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a0a00 0%, #2e1408 50%, #1a0a00 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px 60px",
    overflowX: "hidden",
  };

  const paperStyle = {
    background: "#faf7f2",
    borderRadius: 2,
    maxWidth: 520,
    width: "100%",
    position: "relative",
    boxShadow:
      "0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px #b5804a44, inset 0 0 60px rgba(181,128,74,0.04)",
  };

  const sectionStyle = {
    padding: "0 clamp(24px, 6vw, 56px)",
    textAlign: "center",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#2a1a0a",
  };

  return (
    <div style={cardStyle}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={paperStyle}
      >
        {/* Gold top border */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg, transparent, #b5804a, #d4a96a, #b5804a, transparent)",
          }}
        />

        {/* Header area */}
        <div style={{ ...sectionStyle, paddingTop: 36, paddingBottom: 20 }}>
          {/* Corner florals */}
          <FloralCorner
            style={{ position: "absolute", top: 12, left: 12 }}
          />
          <FloralCorner
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              transform: "scaleX(-1)",
            }}
          />

          <p
            style={{
              letterSpacing: "0.3em",
              fontSize: 10,
              textTransform: "uppercase",
              color: "#b5804a",
              margin: "0 0 12px",
            }}
          >
            Together with their families
          </p>

          <Ring />

          <h1
            style={{
              fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
              fontSize: "clamp(28px, 6vw, 44px)",
              fontWeight: 400,
              color: "#2a1a0a",
              margin: "12px 0 4px",
              lineHeight: 1.2,
              letterSpacing: "0.02em",
            }}
          >
            Anjana & Venusha
          </h1>

          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#b5804a",
              margin: "8px 0 0",
            }}
          >
            Wedding Invitation
          </p>
        </div>

        <Divider />

        {/* Families */}
        <div style={{ ...sectionStyle, paddingBottom: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "start",
              gap: "0 16px",
            }}
          >
            {/* Bride's family */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{ fontSize: 11, color: "#b5804a", letterSpacing: "0.15em", margin: "0 0 6px", textTransform: "uppercase" }}
              >
                Bride
              </p>
              <h2
                style={{
                  fontSize: "clamp(17px, 4vw, 22px)",
                  fontWeight: 400,
                  color: "#4a2810",
                  margin: "0 0 4px",
                  fontStyle: "italic",
                }}
              >
                Anjana
              </h2>
              <p style={{ fontSize: 12, color: "#7a5c42", margin: 0 }}>
                Dissanayake
              </p>
              <p style={{ fontSize: 11, color: "#9e7a5c", margin: "6px 0 0", lineHeight: 1.6 }}>
                Daughter of<br />
                <span style={{ color: "#4a2810" }}>Mr. &amp; Mrs. Dissanayake</span>
              </p>
            </div>

            {/* Ampersand */}
            <div
              style={{
                fontSize: "clamp(28px, 7vw, 42px)",
                color: "#b5804a",
                fontStyle: "italic",
                paddingTop: 20,
                fontFamily: "Georgia, serif",
              }}
            >
              &
            </div>

            {/* Groom's family */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{ fontSize: 11, color: "#b5804a", letterSpacing: "0.15em", margin: "0 0 6px", textTransform: "uppercase" }}
              >
                Groom
              </p>
              <h2
                style={{
                  fontSize: "clamp(17px, 4vw, 22px)",
                  fontWeight: 400,
                  color: "#4a2810",
                  margin: "0 0 4px",
                  fontStyle: "italic",
                }}
              >
                Venusha
              </h2>
              <p style={{ fontSize: 12, color: "#7a5c42", margin: 0 }}>
                Fernando
              </p>
              <p style={{ fontSize: 11, color: "#9e7a5c", margin: "6px 0 0", lineHeight: 1.6 }}>
                Son of<br />
                <span style={{ color: "#4a2810" }}>Mr. &amp; Mrs. Fernando</span>
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Main message */}
        <div style={{ ...sectionStyle, paddingBottom: 24 }}>
          <p
            style={{
              fontSize: "clamp(13px, 3vw, 15px)",
              color: "#5a3c28",
              lineHeight: 1.9,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            You are warmly invited to join us<br />
            as we celebrate the union of our beloved children<br />
            in the sacred bond of marriage.
          </p>
        </div>

        {/* Date / Venue placeholder card */}
        <div
          style={{
            margin: "0 clamp(24px, 6vw, 56px) 28px",
            border: "1px solid #b5804a55",
            borderRadius: 2,
            padding: "20px 16px",
            textAlign: "center",
            background: "rgba(181,128,74,0.04)",
            position: "relative",
          }}
        >
          {/* Corner accents */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
            <div
              key={pos}
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                borderColor: "#b5804a",
                borderStyle: "solid",
                borderWidth: 0,
                ...(pos.includes("top") ? { top: -1, borderTopWidth: 1 } : { bottom: -1, borderBottomWidth: 1 }),
                ...(pos.includes("left") ? { left: -1, borderLeftWidth: 1 } : { right: -1, borderRightWidth: 1 }),
              }}
            />
          ))}

          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#b5804a",
              margin: "0 0 10px",
            }}
          >
            Auspicious Date
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(15px, 4vw, 20px)",
              color: "#2a1a0a",
              margin: "0 0 4px",
              fontWeight: 400,
            }}
          >
            Friday, The 8th of May
          </p>
          <p
            style={{
              fontSize: 13,
              color: "#7a5c42",
              margin: "0 0 16px",
              letterSpacing: "0.05em",
            }}
          >
            2026 &nbsp;·&nbsp; 9:00 in the morning
          </p>

          <div
            style={{
              width: 40,
              height: 1,
              background: "#b5804a55",
              margin: "0 auto 16px",
            }}
          />

          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#b5804a",
              margin: "0 0 8px",
            }}
          >
            Venue
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(14px, 3.5vw, 17px)",
              color: "#2a1a0a",
              margin: "0 0 4px",
            }}
          >
            Asliya Golden Cassendra
          </p>

        </div>

        {/* RSVP */}
        <div style={{ ...sectionStyle, paddingBottom: 8 }}>
          <p style={{ fontSize: 12, color: "#7a5c42", margin: 0 }}>
            Your presence is the greatest gift of all.
          </p>
        </div>

        <Divider />

        {/* Footer */}
        <div
          style={{
            ...sectionStyle,
            paddingBottom: 32,
          }}
        >
          {/* Bottom corner florals */}
          <FloralCorner
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              transform: "scaleY(-1)",
            }}
          />
          <FloralCorner
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              transform: "scale(-1,-1)",
            }}
          />

          <p
            style={{
              fontSize: 12,
              color: "#9e7a5c",
              fontStyle: "italic",
              margin: "0 0 4px",
              lineHeight: 1.8,
            }}
          >
            "Two souls, one heart."
          </p>
          <p
            style={{ fontSize: 11, color: "#b5804a", letterSpacing: "0.2em" }}
          >
            With love &amp; blessings
          </p>
        </div>

        {/* Gold bottom border */}
        <div
          style={{
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #b5804a, #d4a96a, #b5804a, transparent)",
          }}
        />
      </motion.div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.div
          key="envelope"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <Envelope onOpen={() => setOpened(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <InvitationCard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
