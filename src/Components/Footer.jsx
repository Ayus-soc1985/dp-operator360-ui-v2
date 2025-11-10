import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import mscLogo from "../src/Assets/MSC Primary_white.png"


const Footer = () => {
  return (
    <footer 
      className="text-white py-10 px-6 md:px-16"
      style={{ 
        background: "linear-gradient(90.07deg, #020A4E 0%, #1BADD9 100%)" 
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Us Section */}
        {/* <div className="flex flex-col justify-start">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="flex items-center gap-2 mt-2">
            <FontAwesomeIcon icon={faEnvelope} /> support-sandbox@uidai.net.in
          </p>
          <h3 className="mt-4 text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4 mt-2 text-xl">
            <a href="https://www.youtube.com/user/AadhaarUID" className="hover:text-blue-400"><FontAwesomeIcon icon={faYoutube} target="_blank" rel="noopener noreferrer" /></a>
            <a href="https://www.facebook.com/AadhaarOfficial/" className="hover:text-blue-400"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="https://twitter.com/UIDAI" className="hover:text-blue-400"><FontAwesomeIcon icon={faXTwitter} /></a>
            <a href="https://www.instagram.com/aadhaar_official/?hl=en" className="hover:text-blue-400"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQHr9BnmDpFH-QAAAZg3RWcACBabymiunPAbnRvPSdKXqT043RassniU78ZKiGdDIa82VV4q5sdXT6eGgm652bzVgW25pPDRE6rYj71MIlsPDc6oD-1iiBP-yjM5EeJioBdspTg=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Funique-identification-authority-of-india-uidai-" className="hover:text-blue-400"><FontAwesomeIcon icon={faLinkedin} /></a>
          </div>
        </div> */}
        <div className="flex flex-col justify-start">
  <h3 className="text-lg font-semibold">Contact Us</h3>
  <p className="flex items-center gap-2 mt-2">
    <FontAwesomeIcon icon={faEnvelope} /> support-sandbox@uidai.net.in
  </p>
  <h3 className="mt-4 text-lg font-semibold">Follow Us</h3>
  <div className="flex space-x-4 mt-2 text-xl">
    <a
      href="https://www.youtube.com/user/AadhaarUID"
      className="hover:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faYoutube} />
    </a>
    <a
      href="https://www.facebook.com/AadhaarOfficial/"
      className="hover:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faFacebookF} />
    </a>
    <a
      href="https://twitter.com/UIDAI"
      className="hover:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faXTwitter} />
    </a>
    <a
      href="https://www.instagram.com/aadhaar_official/?hl=en"
      className="hover:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faInstagram} />
    </a>
    <a
      href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQHr9BnmDpFH-QAAAZg3RWcACBabymiunPAbnRvPSdKXqT043RassniU78ZKiGdDIa82VV4q5sdXT6eGgm652bzVgW25pPDRE6rYj71MIlsPDc6oD-1iiBP-yjM5EeJioBdspTg=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Funique-identification-authority-of-india-uidai-"
      className="hover:text-blue-400"
      
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faLinkedin} />
    </a>
  </div>
</div>


        {/* UIDAI Head Office Section */}
        <div className="flex flex-col justify-start">
          <h3 className="text-lg font-semibold">UIDAI Head Office</h3>
          <p className="mt-2">Unique Identification Authority of India</p>
          <p>Government of India (GoI)</p>
          <p>Bangla Sahib Road, Behind Kali Mandir, Gole Market,</p>
          <p>New Delhi - 110001</p>
        </div>

        {/* Knowledge Partner Section */}
        <div className="flex flex-col justify-start">
          <h3 className="text-lg font-semibold">Knowledge Partner</h3>
          <a href="https://www.microsave.net/" target= "__blank">          
            <img
            src= {mscLogo}
            alt="MSC - MicroSave Consulting"
            className="mt-4 w-32"
          />
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

