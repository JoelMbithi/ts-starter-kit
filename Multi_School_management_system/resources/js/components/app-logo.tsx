
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square flex-col size-26 items-center text-green-500 justify-center rounded-md  ">
               {/*  <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
             <AppLogoIcon className="size-50 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                   School <br />Management <br /> System
                </span>
            </div>
        </>
    );
}
