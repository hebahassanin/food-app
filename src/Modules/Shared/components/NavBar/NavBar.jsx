import React from 'react'
import { useContext } from 'react'
import { AuthContext} from '../../../../context/AuthContext'
import profileImg from '../../../../assets/images/profile.avif';

export default function NavBar() {
  const {userData}= useContext(AuthContext);
  console.log(userData);
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary rounded-3 mx-3">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item d-flex align-items-center">
                <img className='rounded-circle me-2' style={{width:'32px',height:"32px",objectFit:'cover'}} src={profileImg} alt='profile'/>
                <span className="nav-link p-0 fw-bold">{userData?.userName}</span>
              </li>
            </ul>

          </div>
        </div>
      </nav>

    </>
  )
}
