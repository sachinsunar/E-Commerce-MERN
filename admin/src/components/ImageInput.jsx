import assets from '../assets/assets'

const ImageInput = ({ 
  label, 
  imgKey, 
  image, 
  setImage, 
  existingImages, 
  setExistingImages, 
  removeImages, 
  setRemoveImages 
}) => {
  const preview = image
    ? window.URL.createObjectURL(image)
    : removeImages[imgKey]
      ? assets.upload_area
      : (existingImages[imgKey] || assets.upload_area);

  return (
    <div className="flex flex-col items-center relative">
      <label htmlFor={label} className="cursor-pointer">
        <img className="w-20 h-20 object-cover rounded" src={preview} alt="" />
      </label>

      <input
        id={label}
        type="file"
        hidden
        onChange={(e) => {
          setRemoveImages(prev => ({ ...prev, [imgKey]: false }));
          setExistingImages(prev => ({ ...prev, [imgKey]: null }));
          setImage(e.target.files[0]);
        }}
      />

      {/* X Button */}
      {(existingImages[imgKey] || image) && !removeImages[imgKey] && (
        <button
          type="button"
          onClick={() => {
            setRemoveImages(prev => ({ ...prev, [imgKey]: true }));
            setImage(false);
            setExistingImages(prev => ({ ...prev, [imgKey]: null }));
          }}
          className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-full text-xs"
        >
          X
        </button>
      )}
    </div>
  );
};
export default ImageInput;