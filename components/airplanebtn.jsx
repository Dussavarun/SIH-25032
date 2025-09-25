import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  button {
    position: relative;
    font-size: 1.2em;
    padding: 0.7em 1.8em;
    background: rgba(30, 40, 60, 0.55);
    color: #e0e7ef;
    border: none;
    border-radius: 0.7em;
    cursor: pointer;
    box-shadow: 0 4px 24px rgba(30,40,60,0.18);
    backdrop-filter: blur(8px);
    transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
    overflow: hidden;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  button::before {
    position: absolute;
    content: "";
    height: 0;
    width: 0;
    top: 0;
    left: 0;
    background: linear-gradient(
      135deg,
      rgba(33, 33, 33, 0.7) 0%,
      rgba(33, 33, 33, 0.7) 50%,
      rgba(30, 80, 120, 0.7) 50%,
      rgba(60, 120, 180, 0.7) 60%
    );
    border-radius: 0 0 0.7em 0;
    transition: 0.3s;
    z-index: 0;
  }

  button:hover::before {
    width: 3.5em;
    height: 3.5em;
  }
  button::after {
    position: absolute;
    content: "";
    height: 0;
    width: 0;
    top: 0;
    right: 0;
    background: linear-gradient(
      -135deg,
      rgba(33, 33, 33, 0.7) 0%,
      rgba(33, 33, 33, 0.7) 50%,
      rgba(30, 80, 120, 0.7) 50%,
      rgba(60, 120, 180, 0.7) 60%
    );
    border-radius: 0 0 0.7em 0;
    transition: 0.3s;
    z-index: 0;
  }

  button:hover::after {
    width: 3.5em;
    height: 3.5em;
  }
  button:focus {
    translate: -20px -110px;
    rotate: -30deg;
    transition: 1.2s;
  }
  button:active {
    transform: translate(0.1em, 0.1em);
  }
`;

const Button = ({ children = "Plan Your Journey", ...props }) => (
  <StyledWrapper>
    <button {...props}>
      <b>{children}</b>
    </button>
  </StyledWrapper>
);

export default Button;