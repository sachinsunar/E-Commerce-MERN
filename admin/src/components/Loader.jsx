import React from 'react'

const Loader = ({ show }) => {
    return show && (
        <>
            <div className="fixed inset-0 flex justify-center items-center bg-transparent">
                <div className="w-20 h-20 border-8 border-t-8 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>

        </>
    )
}

export default Loader