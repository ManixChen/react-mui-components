import { useState, useEffect, useRef } from 'react';
import { CircularProgress, LinearProgress, Backdrop, Box, Theme } from '@mui/material';
import { GlobalLoadingProps } from './types';

const DEFAULT_TEXT = 'Operation in progress, please wait...';
const DEFAULT_PROGRESS_INTERVAL = 200;
const DEFAULT_SIZE = '4rem';

export default function GlobalLoading(props: GlobalLoadingProps) {
	const {
		pageLoading = false,
		type = 'circular',
		color = 'inherit',
		text,
		children,
		zIndex,
		allowClose = true,
		sx,
		onLoadingChange,
		progressInterval = DEFAULT_PROGRESS_INTERVAL,
		size = DEFAULT_SIZE,
	} = props;

	const [loading, setLoading] = useState<boolean>(pageLoading);
	const [progress, setProgress] = useState<number>(0);
	const [loadingInfo, setLoadingInfo] = useState<string>(text || DEFAULT_TEXT);
	const timerProgressRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Update loading state when pageLoading changes
	useEffect(() => {
		setLoading(pageLoading);
		onLoadingChange?.(pageLoading);
	}, [pageLoading, onLoadingChange]);

	// Handle linear progress animation
	useEffect(() => {
		if (type === 'linear') {
			// Clear existing timer
			if (timerProgressRef.current) {
				clearInterval(timerProgressRef.current);
				timerProgressRef.current = null;
			}

			if (pageLoading) {
				setProgress(0);
				timerProgressRef.current = setInterval(() => {
					setProgress((val: number) => {
						if (val <= 90) {
							return val + 4;
						} else if (val <= 96) {
							return val + 0.5;
						}
						return val;
					});
				}, progressInterval);
			} else {
				setProgress(0);
			}
		}

		// Cleanup function
		return () => {
			if (timerProgressRef.current) {
				clearInterval(timerProgressRef.current);
				timerProgressRef.current = null;
			}
		};
	}, [type, pageLoading, progressInterval]);

	// Update loading info when text changes
	useEffect(() => {
		setLoadingInfo(text || DEFAULT_TEXT);
	}, [text]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timerProgressRef.current) {
				clearInterval(timerProgressRef.current);
				timerProgressRef.current = null;
			}
			setProgress(0);
		};
	}, []);

	const handleDoubleClick = () => {
		if (allowClose) {
			setLoading(false);
			onLoadingChange?.(false);
		}
	};

	const backdropZIndex = zIndex !== undefined 
		? zIndex 
		: (theme: Theme) => theme.zIndex.drawer + 1;

	if (!loading) {
		return null;
	}

	return (
		<Box sx={{ cursor: 'not-allowed', ...sx }}>
			<Backdrop
				open={loading}
				onDoubleClick={handleDoubleClick}
				sx={{
					color: '#fff',
					zIndex: backdropZIndex,
					position: 'fixed',
					left: 0,
					top: 0,
				}}
			>
				{type === 'linear' ? (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '15px',
							}}
						>
							<Box
								sx={{
									width: '500px',
									height: '20px',
									marginRight: '10px',
								}}
							>
								<LinearProgress
									value={progress}
									variant="determinate"
									color={color}
									sx={{
										height: '18px',
										borderRadius: '10px',
									}}
								/>
							</Box>
							<Box
								component="b"
								sx={{
									color: 'white',
									fontWeight: 'bold',
								}}
							>
								{progress.toFixed(1)}%
							</Box>
						</Box>

						<Box
							sx={{
								paddingTop: '15px',
								fontSize: '16px',
							}}
						>
							{loadingInfo}
						</Box>
						{children && (
							<Box
								sx={{
									paddingTop: '15px',
								}}
							>
								{children}
							</Box>
						)}
					</Box>
				) : (
					<CircularProgress color={color} size={size} />
				)}
			</Backdrop>
		</Box>
	);
}

