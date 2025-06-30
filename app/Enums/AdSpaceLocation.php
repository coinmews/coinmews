<?php

namespace App\Enums;

enum AdSpaceLocation: string
{
    case HEADER = 'header';
    case SIDEBAR = 'sidebar';
    case FOOTER = 'footer';
    case IN_CONTENT = 'in_content';
    case POPUP = 'popup';
    case STICKY = 'sticky';
    case MOBILE_HEADER = 'mobile_header';
    case MOBILE_FOOTER = 'mobile_footer';
    case MOBILE_IN_CONTENT = 'mobile_in_content';
    case MOBILE_POPUP = 'mobile_popup';
    case MOBILE_STICKY = 'mobile_sticky';
}
