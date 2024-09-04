import React from 'react'
import LeftNav from '../../components/LeftNav/LeftNav'

function DashboardWrapper({ children }) {
    return (
        <LeftNav children={children} />
    )
}

export default DashboardWrapper