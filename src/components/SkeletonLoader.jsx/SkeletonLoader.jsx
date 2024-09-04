import { Box, Skeleton, Stack } from '@mui/material'
import React from 'react'

function SkeletonLoader({ userHeight = '100vh' }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: userHeight, width: "100%" }}>
            <Stack padding='10px' sx={{ height: userHeight, width: '100%' }} gap={1}>
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
                <Skeleton variant="rounded" width='inherit' sx={{ height: '10%' }} />
            </Stack>
        </Box >
    )
}

export default SkeletonLoader