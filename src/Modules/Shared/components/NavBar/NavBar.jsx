import React from 'react'
import { useContext } from 'react'
import { AuthContext} from '../../../../context/AuthContext'
import profileImg from '../../../../assets/images/profile.avif';

export default function NavBar() {
  const {userData}= useContext(AuthContext);
  console.log(userData);
  return (
    <>
     <nav className="navbar rounded-3 mx-3" style={{ backgroundColor: '#f8f9fa' }}>
        <div
          className="container-fluid"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="fw-bold" style={{color:"gray"}}>{userData?.userGroup}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              className="rounded-circle me-2"
              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
              src={profileImg}
              alt="profile"
            />
            <span className="fw-bold" style={{color:"gray"}}>{userData?.userName}</span>
          </div>
        </div>
    </nav>
    </>
  )
}
