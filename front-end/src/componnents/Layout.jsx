// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

function Layout() {
    return (
        <div>
            <header>
                    <Navbar />
            </header>
            <main className='mt-10' > {/* Adjusted padding to account for fixed navbar */}
                {/* Placeholder to enable scrolling */}
                <Outlet />
            </main>
        </div>
    );
}




export default Layout;