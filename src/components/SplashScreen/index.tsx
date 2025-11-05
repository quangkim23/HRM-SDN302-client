const SlashScreen: () => JSX.Element = () => {
  return (
    <div className='flex flex-col items-center justify-center fixed z-[2000] top-0 left-0 right-0 bottom-0'>
      <div className='loader border-t-2 border-primary w-10 h-10 rounded-full animate-spin'></div>
    </div>
  );
};

export default SlashScreen;
