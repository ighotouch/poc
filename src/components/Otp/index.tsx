import React, { ChangeEvent, FC, useRef, useState }  from 'react';
import './styles.scss';

type props = {
    length?: number;
    onChange: (pin: string) => void;
}

const Otp: FC<props> = ({ length = 5, onChange}) => {

    const otpRef = useRef<Array<HTMLInputElement | null>>([]);
	const [otp, setOtp] = useState<Array<string>>([]);

    const switchFocus = (index: number, e: ChangeEvent<HTMLInputElement>) => {
		setOtp(otps => {
			const newOtps = [...otps];
			newOtps[index] = e.target.value;
            onChange(newOtps.join(''));
			return newOtps;
		});
		if(e.target.value && index <= length - 1) {
			otpRef.current[index + 1]?.focus();
		} else if(index !== 0) {
            otpRef.current[index - 1]?.focus();
        }
	};
    
    return (
        <div className="otp-container">
            <label>Enter OTP here</label>
            <div className="d-flex justify-content-evenly align-items-center">
                {new Array(length).fill('*').map((_, index) => (
                    <input
                        onChange={e => switchFocus(index, e)} 
                        ref={ref => otpRef.current[index]=ref}
                        maxLength={1} type="tel" 
                        autoComplete="one-time-code"
                        autoFocus={index === 0}
                        value={otp[index] || ''}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default Otp;