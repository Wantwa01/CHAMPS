import React from 'react';
import { TranslationSet } from '../App';
import { FacebookIcon, TwitterIcon, LinkedInIcon, InstagramIcon } from './Icons';

interface FooterProps {
    t: TranslationSet;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
    return (
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700/50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t.headerTitle}</h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md">{t.footerAbout}</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">{t.quickLinks}</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t.home}</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t.services}</a></li>
                            {/* FIX: Removed 'pharmacy' link which did not have a corresponding translation. */}
                            <li><a href="#" className="text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t.team}</a></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">{t.contactUs}</h4>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                            <li>{t.address}</li>
                            <li>{t.phone}</li>
                            <li>{t.email}</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 sm:mb-0">{t.copyright}</p>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors" aria-label="Facebook"><FacebookIcon /></a>
                        <a href="#" className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors" aria-label="Twitter"><TwitterIcon /></a>
                        <a href="#" className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors" aria-label="LinkedIn"><LinkedInIcon /></a>
                        <a href="#" className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors" aria-label="Instagram"><InstagramIcon /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
