import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react'
import NavBar from '../Home/NavBar'

import "./GroupHome.css";

function GroupHome() {
    const [showModal, setShowModal] = useState(false)
    return (
        <div>
            <NavBar />
            { showModal && <Modal showModal={showModal} setShowModal={setShowModal} />}
            <div className="grouphome">
                <div className="grouphome_header">
                    <h3>Classes</h3>
                    <button className='grouphome_createbutton' onClick={() => { setShowModal(true) }}>Create Class</button>
                </div>
                <div className="grouphome_section">
                    {/* <h3>List of classes</h3> */}
                    <ClassBox />
                    <ClassBox />
                    <ClassBox />
                </div>
            </div>
        </div>
    )
}

const ClassBox = () => {
    return (
        <div className='grouphome_classbox'>
            <h3 className='title'>Science</h3>
            <p className='description'>Class Description Goes Here</p>
            <button className='joinButton'>Enter Class</button>
        </div>
    );
}

const Modal = ({ showModal, setShowModal }) => {
    const createClassFieldRef = useRef();
    return (
        <AnimatePresence exitBeforeEnter>
            <motion.div className='grouphome_overlay'>
                <div className='grouphome_content'>
                    <div className='grouphome_overlaycross' onClick={() => { setShowModal(false) }}>
                        <i className='fas fa-times fa-lg'></i>
                    </div>
                    <div>
                        <span> Class Name</span>
                        <input type="text" ref={createClassFieldRef} />
                    </div>
                    <button className='joinButton'>Enter Class</button>
                </div>
            </motion.div>
        </AnimatePresence >
    )
}

export default GroupHome
