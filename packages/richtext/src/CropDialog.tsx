import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Slider,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  Divider,
  Paper,
  Button,
} from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import Cropper from 'react-easy-crop';
import { CropDialogProps } from './types';

/**
 * Default Crop Dialog Component
 * Can be replaced via renderCropDialog prop
 */
export const DefaultCropDialog: React.FC<CropDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onUseOriginal,
  cropImage,
  crop,
  zoom,
  rotation,
  onCropChange,
  onZoomChange,
  onRotationChange,
  onCropComplete,
  cropAspectRatio,
  containerSize,
  onContainerSizeChange,
  pendingFile,
}) => {
  const cropContainerRef = React.useRef<HTMLDivElement>(null);

  // Update container size when dialog opens
  React.useEffect(() => {
    if (open && cropContainerRef.current) {
      const updateSize = () => {
        if (cropContainerRef.current) {
          const rect = cropContainerRef.current.getBoundingClientRect();
          onContainerSizeChange({
            width: rect.width,
            height: containerSize.height || 600,
          });
        }
      };
      // Delay to ensure DOM is ready
      setTimeout(updateSize, 100);
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [open, containerSize.height, onContainerSizeChange]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ '& .MuiDialog-paper': { maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {cropAspectRatio !== undefined ? `Crop Image to A4 Size (210mm × 297mm)` : 'Crop Image - Free Size'}
      </DialogTitle>
      <DialogContent sx={{ padding: '10px 0', overflow: 'hidden' }}>
        {cropImage && (
          <Grid container spacing={2} sx={{ height: `${containerSize.height}px` }}>
            {/* Left: Crop Area */}
            <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Box
                ref={cropContainerRef}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#1a1a1a',
                  overflow: 'hidden',
                  borderRadius: 1,
                  padding: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <Cropper
                  image={cropImage}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={cropAspectRatio}
                  cropShape="rect"
                  showGrid={true}
                  restrictPosition={false}
                  objectFit="vertical-cover"
                  minZoom={0.1}
                  maxZoom={10}
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onRotationChange={onRotationChange}
                  onCropComplete={onCropComplete}
                />
              </Box>
            </Grid>

            {/* Right: Control Panel */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'auto' }}>
              <Paper elevation={2} sx={{ p: 2, height: '100%', overflow: 'auto', backgroundColor: '#fafafa' }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
                  Controls
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Crop Box Size Control - Zoom */}
                  <Box>
                    <Typography gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Crop Box Size (Zoom)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Adjust zoom to change crop box size relative to image. Higher zoom = smaller crop box.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: '60px' }}>
                        {zoom.toFixed(1)}x
                      </Typography>
                      <Slider
                        value={zoom}
                        min={0.1}
                        max={10}
                        step={0.1}
                        onChange={(e, value) => onZoomChange(value as number)}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Box>

                  <Divider />

                  {/* Crop Area Size Control */}
                  <Box>
                    <Typography gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Crop Area Size
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Adjust the height of the crop area. Larger area = easier to select the region you need.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: '60px' }}>
                        {containerSize.height}px
                      </Typography>
                      <Slider
                        value={containerSize.height}
                        min={400}
                        max={1000}
                        step={50}
                        onChange={(e, value) => {
                          onContainerSizeChange({ ...containerSize, height: value as number });
                        }}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Box>

                  <Divider />

                  {/* Rotation Control */}
                  <Box>
                    <Typography gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Rotation
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Tooltip title="Rotate Left 90°">
                        <IconButton
                          size="small"
                          onClick={() => onRotationChange((rotation - 90) % 360)}
                        >
                          <RotateLeftIcon />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="body2" sx={{ flex: 1, textAlign: 'center', minWidth: '60px' }}>
                        {rotation}°
                      </Typography>
                      <Tooltip title="Rotate Right 90°">
                        <IconButton
                          size="small"
                          onClick={() => onRotationChange((rotation + 90) % 360)}
                        >
                          <RotateRightIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Slider
                      value={rotation}
                      min={-180}
                      max={180}
                      step={1}
                      onChange={(e, value) => onRotationChange(value as number)}
                      marks={[
                        { value: -180, label: '-180°' },
                        { value: 0, label: '0°' },
                        { value: 180, label: '180°' },
                      ]}
                    />
                  </Box>

                  <Divider />

                  {/* Instructions */}
                  <Box>
                    <Typography gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Instructions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
                      • Drag the crop box to move it
                      <br />• Drag corners/edges to resize the crop box
                      <br />• Adjust zoom to change crop box size
                      <br />• Adjust crop area size for better selection
                      <br />• Rotate image if needed
                      <br />
                      {cropAspectRatio !== undefined && (
                        <>
                          <br />
                          <strong>Note:</strong> Image must match A4 aspect ratio (210mm × 297mm)
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Box sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button onClick={onClose} sx={{ marginRight: '16px' }} variant="outlined" color="secondary">
            Cancel
          </Button>
          {pendingFile && (
            <Button onClick={onUseOriginal} sx={{ marginRight: '16px' }} variant="outlined" color="warning">
              Use Original Image
            </Button>
          )}
          <Button onClick={onConfirm} variant="contained" color="primary">
            Crop & Insert
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

