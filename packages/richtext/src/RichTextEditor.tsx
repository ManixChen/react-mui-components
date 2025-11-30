/**
 * Rich Text Editor Component for React 18
 *
 * Create By: manixchen
 * Create Date: 2025-11-02 14:00:00
 *
 * Last Modified: 2025-11-02 14:00:00
 * Modified By: manixchen
 * Modification Logic:
 * - Created rich text editor component using React Quill
 * - Integrated with Formik for form management
 * - Supports Material-UI styling
 * - Fixed findDOMNode deprecation warning by using dynamic import and useEffect
 * - Refactored to follow component extraction guidelines: removed internal dependencies, use config object
 *
 * @author manixchen
 * @date 2025-11-02
 */
import React, { useMemo, useRef, useEffect, useState, forwardRef, useCallback } from 'react';
import { Box, CircularProgress, Button } from '@mui/material';
import { Area } from 'react-easy-crop/types';
import { RichTextEditorProps } from './types';
import { DefaultCropDialog } from './CropDialog';
import { formatFileSize, countImagesInContent, createImage, defaultHandleAlert } from './utils';
// Note: CSS files should be imported by the consuming application:
// import 'react-quill/dist/quill.snow.css';
// import 'quill-emoji/dist/quill-emoji.css';

export const RichTextEditor = forwardRef<any, RichTextEditorProps>(
	(
		{
			name,
			value,
			onChange,
			onBlur,
			disabled = false,
			placeholder = '',
			rows = 10,
			height,
			error = false,
			allowImageUpload = true,
			maxImageSize = 2 * 1024 * 1024,
			maxImageCount = 5,
			enableImageCompress = true,
			maxImageWidth = 1920,
			maxImageHeight = 1080,
			imageQuality = 0.8,
			allowEmoji = true,
			enableImageCrop = true,
			cropAspectRatio,
			allowOriginalImageUpload = false,
			config = {},
			renderToolbar,
			renderCropDialog,
		},
		forwardedRef,
	) => {
		// Get external dependencies from config
		const handleAlert = config?.handleAlert || defaultHandleAlert;
		const LoadingButton = config?.LoadingButton || Button;
		const customStyles = config?.customStyles || {};

		const quillRef = useRef<any>(null);
		const handleAlertRef = useRef(handleAlert);
		const processImageFileRef = useRef<((file: File) => Promise<void>) | null>(null);
		const [ReactQuill, setReactQuill] = useState<any>(null);
		const [mounted, setMounted] = useState(false);

		// Image crop state
		const [cropDialogOpen, setCropDialogOpen] = useState(false);
		const [cropImage, setCropImage] = useState<string | null>(null);
		const [crop, setCrop] = useState({ x: 0, y: 0 });
		const [zoom, setZoom] = useState(1);
		const [rotation, setRotation] = useState(0);
		const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
		const [pendingFile, setPendingFile] = useState<File | null>(null);
		const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

		// Update handleAlert ref when it changes
		useEffect(() => {
			handleAlertRef.current = handleAlert;
		}, [handleAlert]);

		// Reset crop state when image changes to ensure full image display
		useEffect(() => {
			if (cropImage) {
				// Reset crop position, zoom, and rotation when new image is loaded
				setCrop({ x: 0, y: 0 });
				setZoom(1);
				setRotation(0);
				setCroppedAreaPixels(null);
			}
		}, [cropImage]);

		// Dynamically import ReactQuill and emoji module after mount
		useEffect(() => {
			// Use dynamic import to avoid findDOMNode warning in strict mode
			Promise.all([import('react-quill'), allowEmoji ? (import('quill-emoji') as Promise<any>).catch(() => null) : Promise.resolve(null)]).then(([quillModule, emojiModule]) => {
				const Quill = quillModule.default.Quill || (window as any).Quill;

				if (allowEmoji && emojiModule) {
					// Register emoji module
					if (Quill && emojiModule.default) {
						try {
							// @ts-ignore - quill-emoji doesn't have type definitions
							const emojiModuleExports = emojiModule.default;
							if (emojiModuleExports.emojiBlot) {
								Quill.register(emojiModuleExports.emojiBlot);
							}
							if (emojiModuleExports.toolbar) {
								Quill.register('modules/emoji-toolbar', emojiModuleExports.toolbar);
							}
							if (emojiModuleExports.textarea) {
								Quill.register('modules/emoji-textarea', emojiModuleExports.textarea);
							}
							if (emojiModuleExports.shortname) {
								Quill.register('modules/emoji-shortname', emojiModuleExports.shortname);
							}
						} catch (error) {
							console.warn('Failed to register emoji module:', error);
						}
					}
				}

				setReactQuill(() => quillModule.default);
				setMounted(true);
			});
		}, [allowEmoji]);

		// Calculate height based on rows
		const editorHeight = useMemo(() => {
			if (height) return height;
			// Approximately 24px per row
			return `${rows * 24}px`;
		}, [rows, height]);


		// Image compression function (recursive helper)
		const compressImageRecursive = useCallback(
			(file: File, quality: number, resolve: (value: { url: string; size: number }) => void, reject: (error: Error) => void) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					const img = new Image();
					img.onload = () => {
						const canvas = document.createElement('canvas');
						let width = img.width;
						let height = img.height;

						// Calculate new dimensions while maintaining aspect ratio
						if (width > maxImageWidth || height > maxImageHeight) {
							const ratio = Math.min(maxImageWidth / width, maxImageHeight / height);
							width = width * ratio;
							height = height * ratio;
						}

						canvas.width = width;
						canvas.height = height;

						const ctx = canvas.getContext('2d');
						if (!ctx) {
							reject(new Error('Failed to get canvas context'));
							return;
						}

						// Draw image with high quality
						ctx.drawImage(img, 0, 0, width, height);

						// Convert to blob with compression
						canvas.toBlob(
							(blob) => {
								if (!blob) {
									reject(new Error('Failed to compress image'));
									return;
								}

								// Check if compressed size is acceptable
								if (blob.size <= maxImageSize) {
									const reader = new FileReader();
									reader.onload = () => {
										// Return both the data URL and the actual blob size
										resolve({
											url: reader.result as string,
											size: blob.size,
										});
									};
									reader.onerror = () => reject(new Error('Failed to read compressed image'));
									reader.readAsDataURL(blob);
								} else {
									// If still too large, reduce quality further
									if (quality > 0.1) {
										compressImageRecursive(file, quality - 0.1, resolve, reject);
									} else {
										// Format file sizes for error message
										const blobSizeStr = formatFileSize(blob.size);
										const maxSizeStr = formatFileSize(maxImageSize);
										reject(new Error(`Image is too large (${blobSizeStr}) even after maximum compression. Maximum allowed size is ${maxSizeStr}.`));
									}
								}
							},
							file.type || 'image/jpeg',
							quality,
						);
					};
					img.onerror = () => reject(new Error('Failed to load image'));
					img.src = e.target?.result as string;
				};
				reader.onerror = () => reject(new Error('Failed to read file'));
				reader.readAsDataURL(file);
			},
			[maxImageWidth, maxImageHeight, maxImageSize, formatFileSize],
		);

		// Image compression function
		const compressImage = useCallback(
			(file: File, quality: number = imageQuality): Promise<{ url: string; size: number }> => {
				return new Promise((resolve, reject) => {
					compressImageRecursive(file, quality, resolve, reject);
				});
			},
			[compressImageRecursive, imageQuality],
		);


		// Get cropped image blob with rotation support
		const getCroppedImg = useCallback(
			async (imageSrc: string, pixelCrop: Area, rotationAngle: number = 0): Promise<Blob> => {
				const image = await createImage(imageSrc);
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				if (!ctx) {
					throw new Error('No 2d context');
				}

				// Set canvas size to the crop area
				canvas.width = pixelCrop.width;
				canvas.height = pixelCrop.height;

				// Fill with white background instead of black (or transparent for PNG)
				ctx.fillStyle = '#FFFFFF';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				if (rotationAngle === 0) {
					// No rotation, simple crop
					// Ensure crop area is within image bounds
					const sourceX = Math.max(0, Math.min(pixelCrop.x, image.naturalWidth));
					const sourceY = Math.max(0, Math.min(pixelCrop.y, image.naturalHeight));
					const sourceWidth = Math.min(pixelCrop.width, image.naturalWidth - sourceX);
					const sourceHeight = Math.min(pixelCrop.height, image.naturalHeight - sourceY);
					const destX = sourceX === pixelCrop.x ? 0 : pixelCrop.x - sourceX;
					const destY = sourceY === pixelCrop.y ? 0 : pixelCrop.y - sourceY;

					if (sourceWidth > 0 && sourceHeight > 0) {
						ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, sourceWidth, sourceHeight);
					}
				} else {
					// With rotation: react-easy-crop provides pixelCrop relative to the rotated view
					// We need to rotate the image first, then crop
					const rad = (rotationAngle * Math.PI) / 180;
					const imageWidth = image.naturalWidth;
					const imageHeight = image.naturalHeight;

					// Calculate rotated image dimensions
					const sin = Math.abs(Math.sin(rad));
					const cos = Math.abs(Math.cos(rad));
					const rotatedWidth = imageWidth * cos + imageHeight * sin;
					const rotatedHeight = imageWidth * sin + imageHeight * cos;

					// Create a temporary canvas for the rotated image with white background
					const tempCanvas = document.createElement('canvas');
					tempCanvas.width = rotatedWidth;
					tempCanvas.height = rotatedHeight;
					const tempCtx = tempCanvas.getContext('2d');

					if (!tempCtx) {
						throw new Error('No 2d context for temp canvas');
					}

					// Fill with white background
					tempCtx.fillStyle = '#FFFFFF';
					tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

					// Center the rotation
					tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
					tempCtx.rotate(rad);
					tempCtx.drawImage(image, -imageWidth / 2, -imageHeight / 2);

					// Ensure crop area is within rotated image bounds
					const sourceX = Math.max(0, Math.min(pixelCrop.x, rotatedWidth));
					const sourceY = Math.max(0, Math.min(pixelCrop.y, rotatedHeight));
					const sourceWidth = Math.min(pixelCrop.width, rotatedWidth - sourceX);
					const sourceHeight = Math.min(pixelCrop.height, rotatedHeight - sourceY);
					const destX = sourceX === pixelCrop.x ? 0 : pixelCrop.x - sourceX;
					const destY = sourceY === pixelCrop.y ? 0 : pixelCrop.y - sourceY;

					if (sourceWidth > 0 && sourceHeight > 0) {
						ctx.drawImage(tempCanvas, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, sourceWidth, sourceHeight);
					}
				}

				return new Promise((resolve, reject) => {
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								reject(new Error('Canvas is empty'));
								return;
							}
							resolve(blob);
						},
						'image/jpeg',
						imageQuality,
					);
				});
			},
			[createImage, imageQuality],
		);

		// Handle crop completion
		const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		}, []);

		// Handle crop confirm
		const handleCropConfirm = useCallback(async () => {
			if (!cropImage || !croppedAreaPixels || !pendingFile) {
				return;
			}

			// Validate aspect ratio if required
			if (cropAspectRatio !== undefined) {
				const actualAspectRatio = croppedAreaPixels.width / croppedAreaPixels.height;
				const expectedAspectRatio = cropAspectRatio;
				const tolerance = 0.01; // Allow 1% tolerance for floating point errors

				if (Math.abs(actualAspectRatio - expectedAspectRatio) > tolerance) {
					handleAlertRef.current(`Image must be cropped to A4 size (210mm × 297mm). Current aspect ratio does not match. Please adjust the crop area.`, 'error');
					return;
				}
			}

			try {
				handleAlertRef.current('Processing cropped image...', 'info');
				const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels, rotation);
				const croppedFile = new File([croppedBlob], pendingFile.name, { type: 'image/jpeg' });

				// Close crop dialog
				setCropDialogOpen(false);
				setCropImage(null);
				setPendingFile(null);
				setCrop({ x: 0, y: 0 });
				setZoom(1);
				setCroppedAreaPixels(null);

				// Process the cropped file (compress if needed)
				if (processImageFileRef.current) {
					await processImageFileRef.current(croppedFile);
				}
			} catch (error: any) {
				handleAlertRef.current(error?.message || 'Failed to crop image', 'error');
			}
		}, [cropImage, croppedAreaPixels, pendingFile, getCroppedImg, cropAspectRatio]);

		// Process image file (with compression if needed)
		const processImageFile = useCallback(
			async (file: File) => {
				const quill = quillRef.current?.getEditor();
				if (!quill) return;

				try {
					let imageUrl: string;
					const fileSizeStr = formatFileSize(file.size);
					const maxSizeStr = formatFileSize(maxImageSize);

					// Compress image if enabled and file is too large
					if (enableImageCompress && (file.size > maxImageSize || file.size > 500 * 1024)) {
						handleAlertRef.current(`Compressing image (${fileSizeStr})...`, 'info');
						const result = await compressImage(file);
						imageUrl = result.url;
						const compressedSizeStr = formatFileSize(result.size);
						handleAlertRef.current(`Image compressed successfully: ${fileSizeStr} → ${compressedSizeStr}`, 'success');
					} else if (file.size > maxImageSize) {
						handleAlertRef.current(`Image size (${fileSizeStr}) exceeds the maximum allowed size (${maxSizeStr}). Please enable compression or reduce image size.`, 'warning');
						return;
					} else {
						imageUrl = await new Promise<string>((resolve, reject) => {
							const reader = new FileReader();
							reader.onload = () => resolve(reader.result as string);
							reader.onerror = () => reject(new Error('Failed to read file'));
							reader.readAsDataURL(file);
						});
					}

					// Insert image into editor
					const range = quill.getSelection();
					const index = range ? range.index : quill.getLength();
					quill.insertEmbed(index, 'image', imageUrl);
					quill.setSelection(index + 1);
				} catch (error: any) {
					handleAlertRef.current(error?.message || 'Failed to process image', 'error');
				}
			},
			[enableImageCompress, maxImageSize, compressImage, formatFileSize],
		);

		// Update processImageFile ref when it changes
		useEffect(() => {
			processImageFileRef.current = processImageFile;
		}, [processImageFile]);

		// Process original size image file (no compression, no crop)
		const processOriginalImageFile = useCallback(
			async (file: File) => {
				const quill = quillRef.current?.getEditor();
				if (!quill) return;

				try {
					// Check current image count from Quill editor content
					const currentContent = quill.root.innerHTML;
					const currentImageCount = countImagesInContent(currentContent);
					if (currentImageCount >= maxImageCount) {
						handleAlertRef.current(`Maximum ${maxImageCount} images allowed. Please remove some images before adding new ones.`, 'warning');
						return;
					}

					// Read file as data URL without any processing
					const imageUrl = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result as string);
						reader.onerror = () => reject(new Error('Failed to read file'));
						reader.readAsDataURL(file);
					});

					// Insert image into editor
					const range = quill.getSelection();
					const index = range ? range.index : quill.getLength();
					quill.insertEmbed(index, 'image', imageUrl);
					quill.setSelection(index + 1);

					const fileSizeStr = formatFileSize(file.size);
					handleAlertRef.current(`Original size image inserted: ${fileSizeStr}`, 'success');
				} catch (error: any) {
					handleAlertRef.current(error?.message || 'Failed to process image', 'error');
				}
			},
			[maxImageCount, countImagesInContent, formatFileSize],
		);

		// Original size image upload handler (no crop, no compression)
		const originalImageHandler = useCallback(() => {
			const input = document.createElement('input');
			input.setAttribute('type', 'file');
			input.setAttribute('accept', 'image/*');
			input.style.display = 'none';
			document.body.appendChild(input);
			input.click();

			input.onchange = async () => {
				const file = input.files?.[0];
				if (!file) {
					document.body.removeChild(input);
					return;
				}

				try {
					await processOriginalImageFile(file);
					document.body.removeChild(input);
				} catch (error: any) {
					handleAlertRef.current(error?.message || 'Failed to process image', 'error');
					document.body.removeChild(input);
				}
			};

			// Cleanup if user cancels
			input.oncancel = () => {
				document.body.removeChild(input);
			};
		}, [processOriginalImageFile]);

		// Setup custom original-image button after mount
		useEffect(() => {
			if (!mounted || !allowOriginalImageUpload || !quillRef.current) return;

			const quill = quillRef.current.getEditor();
			if (!quill) return;

			// Wait for toolbar to be ready
			setTimeout(() => {
				const toolbar = quill.getModule('toolbar');
				if (toolbar && toolbar.container) {
					// Find the original-image button
					let originalImageButton = toolbar.container.querySelector('.ql-original-image');

					if (!originalImageButton) {
						// If button doesn't exist, create it
						const imageButton = toolbar.container.querySelector('.ql-image');
						if (imageButton && imageButton.parentElement) {
							originalImageButton = document.createElement('button');
							originalImageButton.className = 'ql-original-image';
							originalImageButton.type = 'button';
							originalImageButton.setAttribute('title', 'Insert Original Image (No Crop, No Compression)');
							// Use SVG icon for better compatibility
							originalImageButton.innerHTML = `
								<svg viewBox="0 0 18 18" style="width: 18px; height: 18px; display: block;">
									<path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
									<circle cx="9" cy="9" r="2.5" fill="currentColor"/>
								</svg>
							`;
							imageButton.parentElement.insertBefore(originalImageButton, imageButton.nextSibling);
						}
					}

					if (originalImageButton) {
						// Remove existing listeners to avoid duplicates
						const newButton = originalImageButton.cloneNode(true) as HTMLElement;
						originalImageButton.parentNode?.replaceChild(newButton, originalImageButton);

						// Set handler
						newButton.addEventListener('click', () => {
							originalImageHandler();
						});
					}
				}
			}, 200);
		}, [mounted, allowOriginalImageUpload, originalImageHandler]);

		// Custom toolbar configuration - Enhanced to match TinyMCE features
		const modules = useMemo(() => {
			if (!mounted) {
				return {
					toolbar: [],
				};
			}

			// Image upload handler (only if allowImageUpload is true)
			const imageHandler = () => {
				const input = document.createElement('input');
				input.setAttribute('type', 'file');
				input.setAttribute('accept', 'image/*');
				input.style.display = 'none';
				document.body.appendChild(input);
				input.click();

				input.onchange = async () => {
					const file = input.files?.[0];
					if (!file) {
						document.body.removeChild(input);
						return;
					}

					// Check current image count from Quill editor content
					const quill = quillRef.current?.getEditor();
					if (quill) {
						const currentContent = quill.root.innerHTML;
						const currentImageCount = countImagesInContent(currentContent);
						if (currentImageCount >= maxImageCount) {
							handleAlertRef.current(`Maximum ${maxImageCount} images allowed. Please remove some images before adding new ones.`, 'warning');
							document.body.removeChild(input);
							return;
						}
					}

					// If crop is enabled, show crop dialog
					if (enableImageCrop) {
						const reader = new FileReader();
						reader.onload = (e) => {
							setCropImage(e.target?.result as string);
							setPendingFile(file);
							setCropDialogOpen(true);
						};
						reader.onerror = () => {
							handleAlertRef.current('Failed to read image file', 'error');
						};
						reader.readAsDataURL(file);
						document.body.removeChild(input);
						return;
					}

					// Otherwise, process directly
					try {
						await processImageFile(file);
						document.body.removeChild(input);
					} catch (error: any) {
						handleAlertRef.current(error?.message || 'Failed to process image', 'error');
						document.body.removeChild(input);
					}
				};

				// Cleanup if user cancels
				input.oncancel = () => {
					document.body.removeChild(input);
				};
			};

			// Build toolbar items - conditionally include image button
			const toolbarItems: any[] = [
				[{ header: [1, 2, 3, false] }],
				['bold', 'italic', 'underline', 'strike'],
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ indent: '-1' }, { indent: '+1' }],
				[{ align: [] }],
			];

			// Add emoji button if enabled
			if (allowEmoji) {
				toolbarItems.push(['emoji']);
			}

			// Add link and image buttons conditionally
			if (allowImageUpload) {
				toolbarItems.push(['link', 'image']);
			} else {
				toolbarItems.push(['link']);
			}

			toolbarItems.push(
				[{ color: [] }, { background: [] }],
				[{ size: ['small', false, 'large', 'huge'] }], // Font size
				['code-block'], // Code view
				['clean'],
			);

			const toolbarConfig: any = {
				container: toolbarItems,
			};

			// Only add image handler if image upload is allowed
			if (allowImageUpload) {
				toolbarConfig.handlers = {
					image: imageHandler,
				};
			}

			// Add emoji module if enabled
			const modulesConfig: any = {
				toolbar: toolbarConfig,
			};

			if (allowEmoji) {
				modulesConfig['emoji-toolbar'] = true;
				modulesConfig['emoji-textarea'] = true;
				modulesConfig['emoji-shortname'] = true;
			}

			return modulesConfig;
		}, [
			mounted,
			allowImageUpload,
			allowOriginalImageUpload,
			maxImageSize,
			maxImageCount,
			countImagesInContent,
			enableImageCompress,
			compressImage,
			formatFileSize,
			allowEmoji,
			enableImageCrop,
			processImageFile,
			processOriginalImageFile,
		]);

		// Formats - conditionally include image format
		const formats = useMemo(() => {
			const baseFormats = [
				'header',
				'bold',
				'italic',
				'underline',
				'strike',
				'list',
				'bullet',
				'indent',
				'align',
				'link',
				'color',
				'background',
				'size', // Added size format
				'code-block', // Added code block
			];

			// Only include image format if image upload is allowed
			if (allowImageUpload) {
				baseFormats.splice(baseFormats.indexOf('link') + 1, 0, 'image');
			}

			// Add emoji format if enabled
			if (allowEmoji) {
				baseFormats.push('emoji');
			}

			return baseFormats;
		}, [allowImageUpload, allowEmoji]);

		return (
			<Box
				sx={{
					width: '100%',
					marginTop: '8px', // Add spacing from label
					marginBottom: '16px', // Add spacing before next item
					...(customStyles.container || {}),
					'& .quill': {
						height: editorHeight,
						display: 'flex',
						flexDirection: 'column',
					},
					'& .ql-container': {
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						fontSize: '14px',
						fontFamily: 'inherit',
						border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
						borderTop: 'none',
						borderRadius: '0 0 4px 4px',
						overflow: 'hidden', // Prevent content from overflowing container
					},
					'& .ql-editor': {
						flex: 1,
						minHeight: editorHeight,
						overflowY: 'auto',
						wordBreak: 'break-word',
						overflowWrap: 'break-word',
						// Limit image size to prevent page from being stretched
						'& img': {
							maxWidth: '100%',
							height: 'auto',
							display: 'block',
						},
						// Prevent long words from breaking layout
						'& *': {
							maxWidth: '100%',
							boxSizing: 'border-box',
						},
						...(error && {
							borderColor: '#d32f2f',
						}),
					},
					'& .ql-toolbar': {
						border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
						borderRadius: '4px 4px 0 0',
						backgroundColor: '#fafafa',
						padding: '8px',
					},
					'& .ql-editor.ql-blank::before': {
						fontStyle: 'normal',
						color: 'rgba(0, 0, 0, 0.6)',
					},
					// Improve toolbar button styling
					'& .ql-toolbar .ql-formats': {
						marginRight: '8px',
					},
					'& .ql-toolbar button:hover': {
						backgroundColor: '#f0f0f0',
						borderRadius: '3px',
					},
					'& .ql-toolbar button.ql-active': {
						backgroundColor: '#e0e0e0',
					},
					// Custom original-image button styling
					'& .ql-toolbar button.ql-original-image': {
						width: '28px',
						height: '24px',
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
						border: 'none',
						background: 'transparent',
						padding: '2px',
						'&:hover': {
							backgroundColor: '#f0f0f0',
							borderRadius: '3px',
						},
						'& svg': {
							width: '18px',
							height: '18px',
						},
					},
				}}
			>
				{!mounted || !ReactQuill ? (
					<Box
						sx={{
							height: editorHeight,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
							borderRadius: '4px',
						}}
					>
						<CircularProgress size={24} />
					</Box>
				) : (
					<ReactQuill
						ref={(el: any) => {
							quillRef.current = el;
							// Support forwarded ref
							if (forwardedRef) {
								if (typeof forwardedRef === 'function') {
									forwardedRef(el);
								} else {
									forwardedRef.current = el;
								}
							}
						}}
						theme="snow"
						value={value || ''}
						onChange={onChange}
						onBlur={onBlur}
						modules={modules}
						formats={formats}
						readOnly={disabled}
						placeholder={placeholder}
					/>
				)}

				{/* Image Crop Dialog */}
				{renderCropDialog ? (
					renderCropDialog({
						open: cropDialogOpen,
						onClose: () => {
							setCropDialogOpen(false);
							setCropImage(null);
							setPendingFile(null);
							setCrop({ x: 0, y: 0 });
							setZoom(1);
							setRotation(0);
							setCroppedAreaPixels(null);
						},
						onConfirm: handleCropConfirm,
						onUseOriginal: async () => {
							if (pendingFile) {
								try {
									await processOriginalImageFile(pendingFile);
									setCropDialogOpen(false);
									setCropImage(null);
									setPendingFile(null);
									setCrop({ x: 0, y: 0 });
									setZoom(1);
									setRotation(0);
									setCroppedAreaPixels(null);
								} catch (error: any) {
									handleAlertRef.current(error?.message || 'Failed to insert original image', 'error');
								}
							}
						},
						cropImage,
						crop,
						zoom,
						rotation,
						onCropChange: setCrop,
						onZoomChange: setZoom,
						onRotationChange: setRotation,
						onCropComplete: onCropComplete,
						cropAspectRatio,
						containerSize,
						onContainerSizeChange: setContainerSize,
						pendingFile,
					})
				) : (
					<DefaultCropDialog
						open={cropDialogOpen}
						onClose={() => {
							setCropDialogOpen(false);
							setCropImage(null);
							setPendingFile(null);
							setCrop({ x: 0, y: 0 });
							setZoom(1);
							setRotation(0);
							setCroppedAreaPixels(null);
						}}
						onConfirm={handleCropConfirm}
						onUseOriginal={async () => {
							if (pendingFile) {
								try {
									await processOriginalImageFile(pendingFile);
									setCropDialogOpen(false);
									setCropImage(null);
									setPendingFile(null);
									setCrop({ x: 0, y: 0 });
									setZoom(1);
									setRotation(0);
									setCroppedAreaPixels(null);
								} catch (error: any) {
									handleAlertRef.current(error?.message || 'Failed to insert original image', 'error');
								}
							}
						}}
						cropImage={cropImage}
						crop={crop}
						zoom={zoom}
						rotation={rotation}
						onCropChange={setCrop}
						onZoomChange={setZoom}
						onRotationChange={setRotation}
						onCropComplete={onCropComplete}
						cropAspectRatio={cropAspectRatio}
						containerSize={containerSize}
						onContainerSizeChange={setContainerSize}
						pendingFile={pendingFile}
					/>
				)}
			</Box>
		);
	},
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
