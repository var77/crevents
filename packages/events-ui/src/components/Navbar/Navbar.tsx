import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar () {

    const navigate = useNavigate();

    const handleRedirecToMain = () => {
        navigate('/');
    }
    return (
        <div className='navbar-container'>
            <div className='navbar-left-children'>
                <Button type="link" onClick={handleRedirecToMain}>
                    LOGO
                </Button>
            </div>
            <div className='navbar-right-children'>

            </div>
        </div>
    )
}
