const Loader = ({ size = 'md', text = '' }) => {
    const sizeMap = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
        xl: 'w-16 h-16 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizeMap[size]} rounded-full border-primary-500/30 border-t-primary-500 animate-spin`}
            />
            {text && <p className="text-surface-200 text-sm animate-pulse">{text}</p>}
        </div>
    );
};

export default Loader;
