
import React from 'react';
import { useSelector } from 'react-redux';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';

const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Logo />
                    <Search />
                    <UserMenu isAuthenticated={isAuthenticated} user={user} />
                </div>
            </div>
        </header>
    );
};

export default Header;