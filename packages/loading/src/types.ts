import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export type LoadingType = 'circular' | 'linear';

export type ProgressColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';

export interface GlobalLoadingProps {
	/**
	 * Whether to show the loading overlay
	 */
	pageLoading?: boolean;
	/**
	 * Type of loading indicator: 'circular' or 'linear'
	 * @default 'circular'
	 */
	type?: LoadingType;
	/**
	 * Color of the loading indicator
	 * @default 'inherit'
	 */
	color?: ProgressColor;
	/**
	 * Loading message text
	 * @default 'Operation in progress, please wait...'
	 */
	text?: string;
	/**
	 * Custom content to display below the loading indicator
	 */
	children?: ReactNode;
	/**
	 * Custom z-index for the backdrop
	 */
	zIndex?: number;
	/**
	 * Whether to allow closing by double-clicking
	 * @default true
	 */
	allowClose?: boolean;
	/**
	 * Custom styles for the container
	 */
	sx?: SxProps<Theme>;
	/**
	 * Callback fired when the loading state changes
	 */
	onLoadingChange?: (loading: boolean) => void;
	/**
	 * Interval time for linear progress update (in milliseconds)
	 * @default 200
	 */
	progressInterval?: number;
	/**
	 * Size of the circular progress indicator
	 * @default '4rem'
	 */
	size?: string | number;
}

