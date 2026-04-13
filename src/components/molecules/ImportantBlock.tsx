'use client';

import { Alert, AlertTitle, Box, Button, Stack, Typography } from '@mui/material';

type Variant = 'warning' | 'info' | 'error' | 'success';

interface ImportantBlockProps {
    title: string;
    message: string | React.ReactNode;
    actionText?: string;
    onAction?: () => void;
    variant?: Variant;
}


export default function ImportantBlock({
    title,
    message,
    actionText,
    onAction,
}: ImportantBlockProps) {
    return (
        <Alert
            sx={{
                borderRadius: 3,
                mb: 2,
                alignItems: 'flex-start',
                '& .MuiAlert-message': { width: '100%' },
                background: (theme) => theme.palette.warning.main,
                color: (theme) => theme.palette.primary.contrastText,
            }}
            icon={false}
        >
            <Stack direction={{ sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} width="100%">
                <Box>
                    <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>

                    <Typography variant="body2" sx={{ mb: actionText ? 2 : 0 }}>
                        {message}
                    </Typography>
                </Box>

                {actionText && onAction && (
                    <Stack direction="row" spacing={1}>
                        <Button
                            size="small"
                            variant="contained"
                            color='secondary'
                            onClick={onAction}
                        >
                            {actionText}
                        </Button>
                    </Stack>
                )}
            </Stack>
        </Alert>
    );
}