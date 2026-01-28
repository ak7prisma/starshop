interface SubmitLoadingProps {
  label: string;
  loading: boolean;
  disabled: boolean;
}

export default function SubmitLoading({ label, loading, disabled }: Readonly<SubmitLoadingProps>) {

  const ButtonClass = `flex w-full justify-center rounded-md bg-indigo-700 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-indigo-600 duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`;

  return (
    <button
      type="submit"
      disabled={disabled}
      suppressHydrationWarning={true}
      className={ButtonClass}>
      {loading ? (
        <div className="flex justify-center items-center h-5 w-full">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
        </div>
      ) : (
        label
      )}
    </button>
  );
}