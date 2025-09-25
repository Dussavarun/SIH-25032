import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="btn">
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={24} fill="currentColor" className="bi bi-airplane-fill" viewBox="0 0 16 16">
            <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z" />
          </svg>
        </span>
        <span className="text">Book Now</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    width: 180px;
    height: 50px;
    border-radius: 5px;
    border: none;
    transition: all 0.5s ease-in-out;
    font-size: 20px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 600;
    display: flex;
    align-items: center;
    background: #040f16;
    color: #f5f5f5;
  }

  .btn:hover {
    box-shadow: 0 0 20px 0px #2e2e2e3a;
  }

  .btn .icon {
    position: absolute;
    height: 40px;
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s;
  }

  .btn .text {
    transform: translateX(55px);
  }

  .btn:hover .icon {
    width: 175px;
  }

  .btn:hover .text {
    transition: all 0.5s;
    opacity: 0;
  }

  .btn:focus {
    outline: none;
  }

  .btn:active .icon {
    transform: scale(0.85);
  }`;

export default Button;
