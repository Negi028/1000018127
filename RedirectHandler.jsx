import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMapping, addClick } from "../utils/storage";
import Log from "../Log";

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function handle() {
      const mapping = getMapping(shortcode);
      if (!mapping) {
        await Log("Redirect", "error", "RedirectHandler", `Missing ${shortcode}`);
        navigate("/");
        return;
      }
      if (Date.now() > mapping.expiresAt) {
        await Log("Redirect", "warn", "RedirectHandler", `Expired ${shortcode}`);
        alert("This short link has expired.");
        navigate("/");
        return;
      }
      const click = { ts: Date.now(), referrer: document.referrer || null, source: "client" };
      addClick(shortcode, click);
      await Log("Redirect", "info", "RedirectHandler", `Redirect ${shortcode}`);
      window.location.href = mapping.longUrl;
    }
    handle();
  }, [shortcode, navigate]);

  return <div>Redirecting...</div>;
}
