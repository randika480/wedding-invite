import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Shared Decorative Components ────────────────────────────────────────────

const FloralCorner = ({ style }) => (
  <svg viewBox="0 0 80 80" style={{ width: 64, height: 64, opacity: 0.35, ...style }} fill="none">
    <path d="M5 75 Q40 5 75 5" stroke="#b5804a" strokeWidth="1.5" fill="none" />
    <path d="M5 60 Q30 30 60 5" stroke="#b5804a" strokeWidth="1" fill="none" />
    <circle cx="10" cy="70" r="4" fill="#d4a96a" />
    <circle cx="20" cy="55" r="3" fill="#c49058" />
    <circle cx="35" cy="38" r="4" fill="#d4a96a" />
    <circle cx="55" cy="22" r="3" fill="#c49058" />
    <circle cx="68" cy="10" r="4" fill="#d4a96a" />
    <path d="M10 70 Q14 64 10 62 Q6 64 10 70Z" fill="#b5804a" opacity="0.6" />
    <path d="M35 38 Q41 32 37 28 Q31 30 35 38Z" fill="#b5804a" opacity="0.6" />
  </svg>
);

const Divider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px auto", maxWidth: 280 }}>
    <div style={{ flex: 1, height: 1, background: "#d4a96a", opacity: 0.5 }} />
    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, flexShrink: 0 }} fill="#b5804a">
      <path d="M12 2C9.8 4.2 8 6.8 8 9a4 4 0 008 0c0-2.2-1.8-4.8-4-7z" />
      <path d="M7 11C4.8 11 3 12.8 3 15s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" opacity="0.6" />
      <path d="M17 11c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" opacity="0.6" />
    </svg>
    <div style={{ flex: 1, height: 1, background: "#d4a96a", opacity: 0.5 }} />
  </div>
);

const Ring = () => (
  <svg viewBox="0 0 48 24" style={{ width: 64, height: 32 }} fill="none">
    <circle cx="16" cy="12" r="10" stroke="#b5804a" strokeWidth="2" fill="none" />
    <circle cx="32" cy="12" r="10" stroke="#b5804a" strokeWidth="2" fill="none" />
    <circle cx="16" cy="12" r="7" stroke="#d4a96a" strokeWidth="0.8" fill="none" opacity="0.5" />
    <circle cx="32" cy="12" r="7" stroke="#d4a96a" strokeWidth="0.8" fill="none" opacity="0.5" />
    <circle cx="16" cy="7" r="2" fill="#d4a96a" />
    <circle cx="32" cy="7" r="2" fill="#d4a96a" />
  </svg>
);

// ─── Envelope Scene (SVG-based with JS animation) ────────────────────────────

const Envelope = ({ onOpen }) => {
  const flapFrontRef = useRef(null);
  const flapGroupRef = useRef(null);
  const sealGroupRef = useRef(null);
  const hoverLiftRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (opened) return;
    setOpened(true);

    // Step 1 – seal fades away
    if (sealGroupRef.current) {
      sealGroupRef.current.style.transition = "transform .25s ease, opacity .28s ease";
      sealGroupRef.current.style.transform = "scale(.65)";
      sealGroupRef.current.style.opacity = "0";
    }

    // Step 2 – flap opens
    setTimeout(() => {
      animateFlap(() => {
        // Step 3 – envelope sinks and fades
        setTimeout(() => {
          if (hoverLiftRef.current) {
            hoverLiftRef.current.style.transition = "transform .6s ease-in, opacity .55s ease-in";
            hoverLiftRef.current.style.transform = "translateY(28px) scale(.93)";
            hoverLiftRef.current.style.opacity = "0";
          }
          setTimeout(() => onOpen(), 620);
        }, 320);
      });
    }, 300);
  };

  const animateFlap = (done) => {
    const front = flapFrontRef.current;
    const group = flapGroupRef.current;
    if (!front || !group) return done?.();

    const duration = 880;
    const start = performance.now();
    const allPolys = group.querySelectorAll("polygon");

    function ease(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const e = ease(t);

      // Apex of the flap moves from y=148 up to y=-10 (above envelope)
      const apexY = 148 - 158 * e;
      const pts = `0,0 420,0 210,${apexY.toFixed(1)}`;
      front.setAttribute("points", pts);

      // Keep shadow polygons in sync
      allPolys.forEach((p, i) => {
        if (i === 0) return;
        if (i === 1) p.setAttribute("points", pts);
        if (i === 2) {
          const midY = 100 - 108 * e;
          p.setAttribute("points", `170,${midY.toFixed(1)} 250,${midY.toFixed(1)} 210,${apexY.toFixed(1)}`);
        }
        if (i === 3) p.setAttribute("points", pts);
      });

      // When going past halfway, tint flap darker (shows back face)
      if (t > 0.5) {
        const back = (t - 0.5) * 2;
        const r = Math.round(245 - 40 * back);
        const g = Math.round(237 - 50 * back);
        const b = Math.round(219 - 55 * back);
        front.setAttribute("fill", `rgb(${r},${g},${b})`);
      }

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        // Hide flap entirely
        allPolys.forEach((p) => p.setAttribute("opacity", "0"));
        done?.();
      }
    }

    requestAnimationFrame(tick);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 40%, #2a1605 0%, #120800 60%, #080300 100%)",
        padding: "60px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(212,169,106,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          color: "#b8894a", letterSpacing: "0.3em", fontSize: 10,
          textTransform: "uppercase", fontFamily: "Georgia, serif",
          marginBottom: 48,
        }}
      >
        You are cordially invited
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        onClick={handleClick}
        onMouseEnter={() => !opened && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: opened ? "default" : "pointer",
          width: "min(420px, 88vw)",
          userSelect: "none",
        }}
      >
        <div
          ref={hoverLiftRef}
          style={{
            transition: hovered && !opened
              ? "transform .4s cubic-bezier(.22,1,.36,1), filter .4s"
              : "transform .4s cubic-bezier(.22,1,.36,1), filter .4s, opacity .6s, transform .6s",
            transform: hovered && !opened ? "translateY(-10px)" : "translateY(0)",
            filter: hovered && !opened
              ? "drop-shadow(0 28px 48px rgba(0,0,0,.75)) drop-shadow(0 8px 16px rgba(0,0,0,.5))"
              : "drop-shadow(0 18px 36px rgba(0,0,0,.65)) drop-shadow(0 4px 10px rgba(0,0,0,.45))",
          }}
        >
          <svg
            viewBox="0 0 420 260"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", display: "block", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="paperBody" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stopColor="#f8f0de" />
                <stop offset="40%" stopColor="#f2e8d2" />
                <stop offset="100%" stopColor="#ecdfc4" />
              </linearGradient>
              <linearGradient id="flapL" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e8dcc6" />
                <stop offset="100%" stopColor="#ddd0b8" />
              </linearGradient>
              <linearGradient id="flapR" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#e2d6c0" />
                <stop offset="100%" stopColor="#d8ccb4" />
              </linearGradient>
              <linearGradient id="flapB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8dcca" />
                <stop offset="100%" stopColor="#f0e4d0" />
              </linearGradient>
              <linearGradient id="flapTFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5eddb" />
                <stop offset="100%" stopColor="#e4d8c0" />
              </linearGradient>
              <linearGradient id="innerLiner" x1="0" y1="0" x2="0.2" y2="1">
                <stop offset="0%" stopColor="#faf4e6" />
                <stop offset="100%" stopColor="#f0e8d4" />
              </linearGradient>
              <radialGradient id="waxBase" cx="38%" cy="33%" r="60%">
                <stop offset="0%" stopColor="#8c3b14" />
                <stop offset="50%" stopColor="#641f08" />
                <stop offset="100%" stopColor="#3a1004" />
              </radialGradient>
              <radialGradient id="waxHighlight" cx="30%" cy="24%" r="42%">
                <stop offset="0%" stopColor="#b04820" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#b04820" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="waxShadow" cx="62%" cy="68%" r="38%">
                <stop offset="0%" stopColor="#0a0200" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0a0200" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="creaseShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,0,0,0.16)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>
              <linearGradient id="edgeHighlight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* Inner liner */}
            <rect x="2" y="2" width="416" height="256" rx="2" fill="url(#innerLiner)" />
            {[0,60,120,180,240,300,360].map(x => (
              <line key={x} x1={x} y1="260" x2={x+260} y2="0"
                stroke="rgba(181,128,74,0.04)" strokeWidth="1" />
            ))}

            {/* Main body */}
            <rect x="0" y="0" width="420" height="258" rx="3" fill="url(#paperBody)" />
            {[32,64,96,128,160,192,224].map(y => (
              <line key={y} x1="0" y1={y} x2="420" y2={y}
                stroke="rgba(180,150,100,0.05)" strokeWidth=".8" />
            ))}
            <rect x="0" y="0" width="420" height="6" rx="3" fill="url(#edgeHighlight)" />
            <rect x=".5" y=".5" width="419" height="257" rx="2.5" fill="none"
              stroke="rgba(160,128,72,0.22)" strokeWidth="1" />
            <rect x="8" y="8" width="404" height="242" rx="1" fill="none"
              stroke="rgba(181,128,74,0.35)" strokeWidth=".5" />

            {/* Left fold */}
            <polygon points="0,0 0,258 210,130" fill="url(#flapL)" />
            <polygon points="0,0 0,258 210,130" fill="rgba(0,0,0,0.04)" />
            <polygon points="0,0 0,258 210,130" fill="none"
              stroke="rgba(160,120,60,0.12)" strokeWidth=".5" />

            {/* Right fold */}
            <polygon points="420,0 420,258 210,130" fill="url(#flapR)" />
            <polygon points="420,0 420,258 210,130" fill="none"
              stroke="rgba(160,120,60,0.1)" strokeWidth=".5" />

            {/* Bottom fold */}
            <polygon points="0,258 420,258 210,130" fill="url(#flapB)" />
            <polygon points="0,258 420,258 210,130" fill="none"
              stroke="rgba(160,120,60,0.12)" strokeWidth=".5" />
            <line x1="0" y1="258" x2="210" y2="130"
              stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <line x1="420" y1="258" x2="210" y2="130"
              stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

            {/* Crease shadow below flap */}
            <rect x="0" y="0" width="420" height="18" fill="url(#creaseShadow)" />

            {/* Top flap group */}
            <g ref={flapGroupRef}>
              <polygon ref={flapFrontRef} points="0,0 420,0 210,148"
                fill="url(#flapTFront)" />
              <polygon points="0,0 420,0 210,148" fill="rgba(0,0,0,0.05)" />
              <polygon points="170,100 250,100 210,148" fill="rgba(0,0,0,0.08)" />
              <polygon points="0,0 420,0 210,148" fill="none"
                stroke="rgba(160,120,60,0.18)" strokeWidth=".8" />
              <line x1="0" y1=".5" x2="420" y2=".5"
                stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            </g>

            {/* Wax seal */}
            <g
              ref={sealGroupRef}
              style={{ transformOrigin: "210px 128px" }}
            >
              <ellipse cx="213" cy="133" rx="34" ry="33"
                fill="rgba(0,0,0,0.32)" />
              <path
                d="M210 97 C222 97 240 106 243 118 C246 130 242 152 230 157 C218 163 196 160 188 150 C180 140 180 120 190 110 C196 103 202 97 210 97Z"
                fill="url(#waxBase)"
              />
              <path
                d="M210 97 C222 97 240 106 243 118 C246 130 242 152 230 157 C218 163 196 160 188 150 C180 140 180 120 190 110 C196 103 202 97 210 97Z"
                fill="url(#waxHighlight)"
              />
              <path
                d="M210 97 C222 97 240 106 243 118 C246 130 242 152 230 157 C218 163 196 160 188 150 C180 140 180 120 190 110 C196 103 202 97 210 97Z"
                fill="url(#waxShadow)"
              />
              <path
                d="M210 97 C222 97 240 106 243 118 C246 130 242 152 230 157 C218 163 196 160 188 150 C180 140 180 120 190 110 C196 103 202 97 210 97Z"
                fill="none" stroke="rgba(160,58,24,0.6)" strokeWidth="1.5"
              />
              <ellipse cx="210" cy="128" rx="24" ry="23" fill="none"
                stroke="rgba(160,58,24,0.3)" strokeWidth=".7" />
              <ellipse cx="210" cy="128" rx="20" ry="19" fill="none"
                stroke="rgba(200,80,30,0.25)" strokeWidth=".5" />
              <path d="M210 108 Q213 116 220 116 Q213 116 210 124 Q207 116 200 116 Q207 116 210 108Z"
                fill="#d4a060" opacity=".9" />
              <path d="M210 132 Q213 140 220 140 Q213 140 210 148 Q207 140 200 140 Q207 140 210 132Z"
                fill="#d4a060" opacity=".45" />
              <path d="M190 128 Q198 131 198 138 Q198 131 206 128 Q198 125 198 118 Q198 125 190 128Z"
                fill="#d4a060" opacity=".45" />
              <path d="M214 128 Q222 131 222 138 Q222 131 230 128 Q222 125 222 118 Q222 125 214 128Z"
                fill="#d4a060" opacity=".45" />
              <circle cx="210" cy="128" r="3.2" fill="#d4a060" opacity=".85" />
              <text x="210" y="126" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8"
                fill="#e8bc78" opacity=".92" letterSpacing="2.2" fontStyle="italic">
                A&amp;V
              </text>
            </g>
          </svg>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 0 : 1 }}
        transition={{ delay: opened ? 0 : 1.6, duration: 0.4 }}
        style={{
          color: "#8a6030", fontSize: 11, marginTop: 28,
          letterSpacing: "0.2em", fontFamily: "Georgia, serif",
        }}
      >
        tap to open
      </motion.p>
    </div>
  );
};

// ─── Invitation Card ──────────────────────────────────────────────────────────

const InvitationCard = () => {
  const sectionStyle = {
    padding: "0 clamp(24px, 6vw, 56px)",
    textAlign: "center",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#2a1a0a",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1a0a00 0%, #2e1408 50%, #1a0a00 100%)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "40px 16px 60px", overflowX: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "#faf7f2", borderRadius: 2, maxWidth: 520, width: "100%",
          position: "relative",
          boxShadow: "0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(181,128,74,0.27), inset 0 0 60px rgba(181,128,74,0.04)",
        }}
      >
        <div style={{ height: 4, background: "linear-gradient(90deg,transparent,#b5804a,#d4a96a,#b5804a,transparent)" }} />

        <div style={{ ...sectionStyle, paddingTop: 36, paddingBottom: 20 }}>
          <FloralCorner style={{ position: "absolute", top: 12, left: 12 }} />
          <FloralCorner style={{ position: "absolute", top: 12, right: 12, transform: "scaleX(-1)" }} />
          <p style={{ letterSpacing: "0.3em", fontSize: 10, textTransform: "uppercase", color: "#b5804a", margin: "0 0 12px" }}>
            Together with their families
          </p>
          <Ring />
          <h1 style={{ fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", fontSize: "clamp(28px, 6vw, 44px)", fontWeight: 400, color: "#2a1a0a", margin: "12px 0 4px", lineHeight: 1.2, letterSpacing: "0.02em" }}>
            Anjana &amp; Venusha
          </h1>
          <p style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#b5804a", margin: "8px 0 0" }}>
            Engagement Invitation
          </p>
        </div>

        <Divider />

        <div style={{ ...sectionStyle, paddingBottom: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "start", gap: "0 16px" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#b5804a", letterSpacing: "0.15em", margin: "0 0 6px", textTransform: "uppercase" }}>Bride</p>
              <h2 style={{ fontSize: "clamp(17px, 4vw, 22px)", fontWeight: 400, color: "#4a2810", margin: "0 0 4px", fontStyle: "italic" }}>Anjana</h2>
              <p style={{ fontSize: 12, color: "#7a5c42", margin: 0 }}>Dissanayake</p>
              <p style={{ fontSize: 11, color: "#9e7a5c", margin: "6px 0 0", lineHeight: 1.6 }}>
                Daughter of<br /><span style={{ color: "#4a2810" }}>Mr. &amp; Mrs. Dissanayake</span>
              </p>
            </div>
            <div style={{ fontSize: "clamp(28px, 7vw, 42px)", color: "#b5804a", fontStyle: "italic", paddingTop: 20, fontFamily: "Georgia, serif" }}>&amp;</div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#b5804a", letterSpacing: "0.15em", margin: "0 0 6px", textTransform: "uppercase" }}>Groom</p>
              <h2 style={{ fontSize: "clamp(17px, 4vw, 22px)", fontWeight: 400, color: "#4a2810", margin: "0 0 4px", fontStyle: "italic" }}>Venusha</h2>
              <p style={{ fontSize: 12, color: "#7a5c42", margin: 0 }}>Fernando</p>
              <p style={{ fontSize: 11, color: "#9e7a5c", margin: "6px 0 0", lineHeight: 1.6 }}>
                Son of<br /><span style={{ color: "#4a2810" }}>Mr. &amp; Mrs. Fernando</span>
              </p>
            </div>
          </div>
        </div>

        <Divider />

        <div style={{ ...sectionStyle, paddingBottom: 24 }}>
          <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "#5a3c28", lineHeight: 1.9, margin: 0, fontStyle: "italic" }}>
            You are warmly invited to join us<br />
            as we celebrate the union of our beloved children<br />
            in the sacred bond of marriage.
          </p>
        </div>

        <div style={{ margin: "0 clamp(24px, 6vw, 56px) 28px", border: "1px solid rgba(181,128,74,0.33)", borderRadius: 2, padding: "20px 16px", textAlign: "center", background: "rgba(181,128,74,0.04)", position: "relative" }}>
          {["top-left","top-right","bottom-left","bottom-right"].map(pos => (
            <div key={pos} style={{ position: "absolute", width: 12, height: 12, borderColor: "#b5804a", borderStyle: "solid", borderWidth: 0, ...(pos.includes("top") ? { top: -1, borderTopWidth: 1 } : { bottom: -1, borderBottomWidth: 1 }), ...(pos.includes("left") ? { left: -1, borderLeftWidth: 1 } : { right: -1, borderRightWidth: 1 }) }} />
          ))}
          <p style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#b5804a", margin: "0 0 10px" }}>Auspicious Date</p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(15px, 4vw, 20px)", color: "#2a1a0a", margin: "0 0 4px", fontWeight: 400 }}>Friday, The 8th of May</p>
          <p style={{ fontSize: 13, color: "#7a5c42", margin: "0 0 16px", letterSpacing: "0.05em" }}>2026 &nbsp;·&nbsp; 9:00 in the morning</p>
          <div style={{ width: 40, height: 1, background: "rgba(181,128,74,0.33)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#b5804a", margin: "0 0 8px" }}>Venue</p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px, 3.5vw, 17px)", color: "#2a1a0a", margin: "0 0 4px" }}>Asliya Golden Cassendra</p>
        </div>

        <div style={{ ...sectionStyle, paddingBottom: 8 }}>
          <p style={{ fontSize: 12, color: "#7a5c42", margin: 0 }}>Your presence is the greatest gift of all.</p>
        </div>

        <Divider />

        <div style={{ ...sectionStyle, paddingBottom: 32 }}>
          <FloralCorner style={{ position: "absolute", bottom: 12, left: 12, transform: "scaleY(-1)" }} />
          <FloralCorner style={{ position: "absolute", bottom: 12, right: 12, transform: "scale(-1,-1)" }} />
          <p style={{ fontSize: 12, color: "#9e7a5c", fontStyle: "italic", margin: "0 0 4px", lineHeight: 1.8 }}>"Two souls, one heart."</p>
          <p style={{ fontSize: 11, color: "#b5804a", letterSpacing: "0.2em" }}>With love &amp; blessings</p>
        </div>

        <div style={{ height: 4, background: "linear-gradient(90deg,transparent,#b5804a,#d4a96a,#b5804a,transparent)" }} />
      </motion.div>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [opened, setOpened] = useState(false);
  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.div key="envelope" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <Envelope onOpen={() => setOpened(true)} />
        </motion.div>
      ) : (
        <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.65 }}>
          <InvitationCard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
