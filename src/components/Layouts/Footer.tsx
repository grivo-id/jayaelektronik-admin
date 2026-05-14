const Footer = () => {
    return (
        <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 pt-0 mt-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© {new Date().getFullYear()}. Jaya Elektronik All rights reserved.</span>
            <span className="text-xs text-gray-400">Powered by Grivo Team</span>
        </div>
    );
};

export default Footer;
