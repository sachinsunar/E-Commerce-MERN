import React from 'react'

const Loader = ({ show }) => {
    return show && (
        <>
            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
            </div>
        </>
    )
}

export default Loader