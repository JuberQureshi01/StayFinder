
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/" className="flex-shrink-0">
            <div className="flex items-center">
                <span className="text-2xl font-bold text-[#FF385C] ml-2 ">StayFinder</span>
            </div>
        </Link>
    );
};

export default Logo;