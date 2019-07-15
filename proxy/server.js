/**
 * Counter-Strike: Global Offensive to BetterTouchTool proxy in Node.js.
 * Author: Marek Kaczkowski
 */

http = require('http');
fs = require('fs');
open = require('open');

port = 2746;
host = '127.0.0.1';

// Widget
// TODO: Refactor.
uuid = null;
text = '';
// Icons
// See: https://www.base64-image.de/
icon = '';
iconHealth = "iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0OGQxZDgyOC04ZTc1LTQyOTYtYjI3NS00Y2Y5NTJlYWI2OWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0MyRUM2ODQ5RTg0MTFFOUJGQTBFQTBGODZGRTRCRUMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0MyRUM2ODM5RTg0MTFFOUJGQTBFQTBGODZGRTRCRUMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI0MzU0OGItYTI2NS00NjljLWJmNzgtMjU1ZmMxN2NjZDMyIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWIzYWZmZmQtYWVkNC00NDQ0LWI1MmYtNThjMzljMTlmNDg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XlUncgAAA1xJREFUeNq8Wc1uFDEMjrNpC+VPcOWKxIkTvAJvwJ235MBzUCFVXEDiQg8VSIh2accklQd50/gnmZ1GsjQzO5P454vz2Quhb8Qs77Pcz3IRxgdmOciSsnzM8sX7YRpYrCwEWZ463wem5Hxfrq+yXJITwpoKl4UeZnlFi0+V57hSIPx2mOU0y7fexdOCkJaFN4IXQ6V47e3RdYc+5Mpdk4DDOD6u6TmGgU004l3pGVbX2jdDIw5612MIhBVGGsQuvwanAcgwjaMGpQWQAOE+KJkiGEauBgkQQo9CVmjhG+8KEtjYUCAoKGEZlkDiGeVTy+JLOpLB2Fwc2yjk5NnoSIdQ0eOJYcTN9+XFd3TyXNGpZVn+l+XRVp4FR6YAmmOb5XWWN451i66bxKx9QBZjtaOhCm8x7Jh5EZRsAEqGOSY+cqisxb8rxk1c4Zek9FbZ4fWi2HgWhGd8rrLGcxLr/dkpJ1nOUxWmyDJHawPFxgYE5dBAYS4enamRraDKZHF+ltgLE8OxlXODEEIJz61oTYrBUuREy1DZ7aGx+8EwzHMKokBRdxSPTnYlphlBITBOQBBw2orQzn1UWBc4eC0IG64FB3R4WWJ/tyDRCjE6cCwd22hkDez0PFgYlhTweKelhMY9uqiAl/yAEgEPc7PIERqw/L9ecnBeC8e9G1XDu8YMoXUQBGWXohHWHtiAkDZNqEXFg7UR2qaCxuLQEaFWemu2CaISVnSUSRp51zzreQ+sikM65YICEZSwpkAKjKIVNRqQGpNvHEwtGP0INIi+dPDw65YzIVXe3DDyg41oICNKZnWgMDmktaLiHG7QDlubLTmlezRIePHsvSwvDKKkKXuU5WuWM0bgrQj9KY1IDomfLMxaji0l0qOKloLB7upnxUm/s/wg40GIDDAqejSXSB8qKEhjS5O/rQ4cUIpRCR4TzVGU+JTlc5bHjpbETYn0vbOPMSnlPApUUeIlZa7zLL9IVmkGRiUlQSMd7a0RuI9mIBqlPBhZZHWF0aiMpdIe99XVXOJhrR8h9ScWQ2QEw9Dx+17xuxQSEpvzdDqHDVnyH0cMt/9F0ngFb8akUSwv+Y8DhdoLHY3tO+3AH1CH6MRR16FS/lzQybm6wls6ys86vVW/d+ikBDvjnwADALnVTPRzMLGYAAAAAElFTkSuQmCC";
iconHelmet = "iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0OGQxZDgyOC04ZTc1LTQyOTYtYjI3NS00Y2Y5NTJlYWI2OWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0MzMkMxOUY5RTg0MTFFOUJGQTBFQTBGODZGRTRCRUMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0MzMkMxOUU5RTg0MTFFOUJGQTBFQTBGODZGRTRCRUMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI0MzU0OGItYTI2NS00NjljLWJmNzgtMjU1ZmMxN2NjZDMyIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWIzYWZmZmQtYWVkNC00NDQ0LWI1MmYtNThjMzljMTlmNDg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lvL2/wAABqVJREFUeNq0WV9vVEUUn7l7d7vdQllsi5DY2vifShqLD000Rt8lPFDCZ+CJD8ArgRfe+A48IpIYjcY3NTGaWDGKRSxKQCxUWqDddru7947n1N80J9OZubeAk5zM7tw7M785/89cbYxR3LTWymlVoj70TDVQHePub+5TogpRPy9JtE7UA22AuiD+vUbUxv+O6C1tNYszFWNjRNPYTAFEYt8nytDnGLMnrIA0Dpai5zaAeV0xt4ffBnMS0dv9cszJQd8R3XABv0Q0hN+WU7ZPAMKO2fEqnqXiHblxJg5rQXcBOhPjVgq5eJajZ06/7ANsOfkK0T5M0J7TW44YMUdy3ohn9rAG3NZiruRmLuZlYp+HRL8KaXoB94PaYuMMJ9cOICXUwzi/tXOQzNlHO6qlHIawTTRcw3IBS3A9B5BygOoAAON5pgLgjGd/IyTQc+clKty0wzFTAMgEQGnPgX0qpRxj9EnSC9gEFtaesRDnQpLRAc5qj5S8kkgDm7riNYFN3TnWY2jHHWbOHJ9q6MCahToc44IPqEIA0QgGj/v6+jbnbmzw3y3jSWDIeQCsioD1eglToM8+kaUAtHj06FF1+PDhKrUsSZIM0SnJsmxjbm6uffHiRQZ7APPaEdC+fbawaRGaP6DuNaIJohFwK2QsBlw1x48ff3To0KEWcXO90WjsrlQqKQOl9Tbf435tbW2V+/X19aHz58/zIXcjLMekye+tEl0lukVrfhYyOu2xbFfvOGybU6dOrYyPjy/UarX6wMDAMIHqy/O8Qotr6hP+TRxOSUWa9M7eNE3vnzlzZoXVBoEkD3glV6ql3JqKuKnazMwM6+pfzWZzPwMrsY4iCYyQJNpnz57tgMO1QLAJGXzQrcUaq8K9gwcPPmSw3hP+pw7bxpiY28vLy/dIlVpWUhHXWOiHfc58WwSizdiYuix6H2DfuB1j0ENDQ8NTU1MKOpqKtU3E928DXHRCawhrk5OTlcHBwabaQZNcZ71ut9uPCLRUCxegLsNh7TEwOamPVKHV7XaXeNOdAHa5zt5keno6cbJCVRQZk4KcQC7E72ZHjhyhvSrVstwMPSOv0RgdHTUwvmrJ4FXoJYzjyhbJfa1QcGjshJu+Z+z2WC0mJibWHcCx7M6rw6HsLD958mQqjY25RdzuUWsJWnX6LaJ5G5L75DHqJ06cqCHyJRE3Gs0lfG6G31sZGxvLadM9tGlOUYv9cL3T6QwsLS3VLly4cNOp94xTXeSnT59+ddeuXR3yxY/7+/t30+HrFExWUQYNi5BtHFKhXEIHXF1lZGSkR2LsUJ5QYy7Pz8/vvXTpEic4tlqejKjVZpl07ty5zRqPvMPgsWPHCGvabbVatpoeiaiEDqWXxgmXW9xeXFzkfKFHKpBduXKlf3Z29nlRsueBRMa2nmDGHprbILpDYTqDinQ9QCXYni/5eU8kPwdwaguAjWyB6CvekOh9HLZTwhX5Mr0a1v+aaJnoLaI3cI8hjZyf/Uj0J+H80uVwW3DMVYsNAB0Vc3qBBNxEKhM7nqEfBrBhZz3rEDrigmWbSizjpTVPFpXj2dvizsBE8mUVSWosYF7vTVEldzxzbOW+5HNrf6NfETrnVtNZJA30FZQqope5+N/1POe9HsFH3/VxuAUuK3B5EKpgSlTPoXqsqOTPA54lhT4vgfMPQpHuNkA+iDhyFdDRMtW0dhIbX1lvwNUH4PCdWGi+CiO4jROmDghTwiOE3lWeuwffYarg6h1I+VoMMOvNTYhiAQWmLsgzTMHNkK+KCBmpwZ4LoHtE94uSn2/hd6+j9qpH7tBUQG8LI1aAEXXs+RsK1W/KZGtssd/DpVwTOhW7kTElyivfO3LMXsBcF6CXyqaXv6B8uYUFasJf6kh1oktcW/n0toI9bkAlNaKg2kk+/AlOPUc0D3GlASPTJXQ9pO/2E8M87oJZFT4OgSpK4D8CyJ/A6aqnOlARURfprf02wuL/GXt9KvKY7SKJfJSRhjADDzKOJKUBt5cXXLWaiGo0AOw61IAvVi7LIOH7KFMGsJXEDLjbRFa3T1wA5gUXhhK4/cK0CM7+g/UvI8KqZwHYtneJXodj58ztBaLn8KwTyYsTiF7hu8VtUIIc5vMSVfcTAVb40vQhwKXInfeD8zUn86oKV/kQQeAupMIH+MINvf8HYNtYLd4RobaJwzQRUjUyv2VBOQ7xA9HsDu81nhqwbS8STYHTLQBtQtzLMNYGggCD/P1JNnmWgLeqdnyctB8oLeA/AHLtaRa3OP8VYAC9oRYdT8s4UgAAAABJRU5ErkJggg==";
iconArmor = "iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0OGQxZDgyOC04ZTc1LTQyOTYtYjI3NS00Y2Y5NTJlYWI2OWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0MyRUM2ODg5RTg0MTFFOUJGQTBFQTBGODZGRTRCRUMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0MyRUM2ODc5RTg0MTFFOUJGQTBFQTBGODZGRTRCRUMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI0MzU0OGItYTI2NS00NjljLWJmNzgtMjU1ZmMxN2NjZDMyIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWIzYWZmZmQtYWVkNC00NDQ0LWI1MmYtNThjMzljMTlmNDg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lp6eXQAABJhJREFUeNq0WVlrFEEQ7pqdza738eCFBwTx2UfRn+Cjv1MFEQWfFUQUJYgaMYomGOMZrxjd3bTd8rVW2qrqnkUbipmd6en66q7uJe+9i4OIXDbaQINAM4H6uEYa4jrI7tO8Hp43gdYCTQKNA30P9COj+H4d9yPQD8wdcTAJZ8ueHQ10CswcY/5rPhjH6waeJQkbrEO49tnvbQA7Zt+me485PbZOg/sk5AbubwV6kgOeDbSXabeHa1poBtd+9j7N6bHnDQOVQE5wP2K/E7ARA8jnTqDx4xLgpMn4ch8mE9NCwzRBDJBj9wmgZ9+2zFrELJPGBlsngUx8VgM9ZLw3AU4gtgTaGugbWyhpggtG7OrYXJcJlFxoLIB1wjoJ3BAutWntVlggmWgivPOZlnKwpMyTgLnMOrnQKQA3rdNmH1rDG0zJmOcV4VyHdX6PRgBlCVB65hWzc0CcvAJcAv8XYBJMmpubhIAjVx6kCEiKa6ijqWAgMaOOlsnfaX5LJTxthTYoCyKfBVFJUDIASf5OgjDe0rDPKpHP3IAEITRNe8MCUhCTFmwSYMk0vmB+V3ARqvBrqviGtKCzop2UHOwEN6GOwvkCf29pWAOVu4tU2Vylu5TSIAlYxNKs+ZtWAEpFwlVY0PTZXKi24J+kaNF6R0p26ZKr1VTZKB9pEV5iSEbf4AvfVAWslSUkplowWYVDEr4mKMXK1yjdlO9QvZzhv74QxNRR+39pmApdmlUcyGBYq4iikhqj3pNRVrW0U1PRyMjbxSLVFMwgaZcqXEPrESzreSPwyNoiuUKDXQoUUgqLU3oRa1eT7seShseMrJ6XlBTmlXnecDlvCExslz2RNLzO9nNNRbL3Rr4lxY+pYBn+vGEHLqKGP2ArvpZtvWvBekPjVNnG5m60DizvJMDLuH6GRL0ODYvUS5Di9zX5OrnoJxzgLEuAv0KSD9Byf4oi4Sr769K2qA/tvsU52zstrS2yCY1RMKxyXpN1SqD7wBA1vGTl4TmcRC5BwraQgmqaGyvHSmv2wDsqb2egRxbgmD4WYIpl+I+lEV/ounxFLs8FikdUK4Fe4bpSKs03caY1jwDcohz6WaXUKgpak+Nh3cjzcaBdgW7U9BIxD9+GWR4grbTCqU3NLps6lPc+nj+C70aFva89SLkf6EugF5B2yA6etWCjilMeUvw6nT9HXk/x7nqXk584LkOzD3GYPGCgqaI1JCOwOPAe3G4B2t0e6FLXo6o0zmPBOZgo/c/hO2ynrM3lADQPq0ZeV5FapwIc/fkCFor+fA/PtrFvqXA8oPUk25GV5rB2PES/Eui1ubUx/kXKBTsH7cboPRFof1bvqbJnHuL9G/jsW6x/ERVWNkfCWQk4jTMAG7V8JNBh9+ePnPzUPv8bYID7jwjmRTx/GehaifG0gB0AnmVV6UCgg4F2wwIEHyTWj4wAdAUF6Rs0fS0vvf8DcBpR06fdnz9eoiB7cN0BwLEIrCKfrsICUag7ge52YfYvAKdxLNDJQIfQ8RG03aDzmyCg3gPkk2mYSP+ETjueg6KPzoJSdoiAnwHk2j/g5X4KMAC8jv/J80kaVAAAAABJRU5ErkJggg==";
iconAmmo = "iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0OGQxZDgyOC04ZTc1LTQyOTYtYjI3NS00Y2Y5NTJlYWI2OWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0MzMkMxOUI5RTg0MTFFOUJGQTBFQTBGODZGRTRCRUMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0MzMkMxOUE5RTg0MTFFOUJGQTBFQTBGODZGRTRCRUMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI0MzU0OGItYTI2NS00NjljLWJmNzgtMjU1ZmMxN2NjZDMyIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWIzYWZmZmQtYWVkNC00NDQ0LWI1MmYtNThjMzljMTlmNDg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+BNX0lgAAA1tJREFUeNrMmNtPE2EQxXeXIhGLhaJWvEdMRCVeIsoD+qL/uoqXKEF9UASNBoQq0FJAlEvXmeT3JeNmFwVpvz3JyUK7hLOzZy7fhHEcBxZhGOrlujASTgr/vMEDrMYo5ftbwk3hivBhkDOkCQ6J6hnhHNHOteBXwuPCb1x/CR9k3JsLwYovwoJwS1gRVoXXhF15FlwWLvJ7v3BbOCY84lNwmFElFH3CQTytke3gAZp4u5GXKuFQQ2SN+5pEWq1yW9ibtwgrDpkyV6R66EMsY5ElkjMXEQ4QGlOTXcnbwS6dwiHh2TwkncVz4Uk868Lv7PEZ8bkSrFgVriM0IsqaeAPC18ISD5UbwW+ox3XhBtce4VMifZ7vcyNY8R0vb+Ptl8IrtPCIz+7nSfAUkdRaPCMcxSKafEdp4/PCu3zmpayloVt4g2iXEBfDiAfSEviJt3KgZW0/gi8Lf1DOCkZsaESvEH1N1I/trMNpeC88Z+aMJJpEPiAxy748bPFCeEy4ZhpKcp4uU1GG8iDYdcC1hNjAWKRJbZ4V3vMtOMCbPczMgfGxjbI7uXwV3vEtuMpwtILAMJF87lrAHtraL/kUHDCtbcIwEWEb6W4ervi/Y+n/Cp6iYVSNBayX7c9lPH/Vp2DFOEPQPLOyFWsfQgemU8IFjlpt63Rp0Nd8EVGlRDNJYockLHNCb3njSEPdLF82M8qcQ8HU8EEflnB4yyuvZiSgFd/NDNK711P4QS9Hnhg/R4nuZ68xUa7vdbPUim3OO8pX3ZS1tKqhnfA0b2TMp+BlEmuVLhgG2RvQJieVWU7nXgQHnPNOpPg5TrFIJ/bQHd4FX4IDzntuLxdllDhnjaJZiXX5Eqz4gIDGXyLdpGNqWRzxKXiR7tcwU12QIdp1wrndxtF27HwnzAHVejdpEfdZkXsrvgQ7Pw+wh4tSZg3HJU7ga3i/zMx94LPEv6BC5ehAlD1pb1EOtfM94/4R2viGaJxsd4TtwN9gGeP+/zpNpoTYXhYyC9y/4SvCDmMkli5laojS/YUuFofNcuYniTjdimltL3jM4XSGwWcCsaNmPG1gn+nkHxcCP6ghehzRw7TyfhKzwnctG+D3i5v4WUUcxq99vIW4lQP8ftHDwF+iBmvyPdplWAp+CzAAeCIZ5c/0LmEAAAAASUVORK5CYII=";
// Colors
color = ''
defaultColor = "60,255,32,255";

const bttAsyncUpdateWidget = async (uuid, text, icon, color) => {
  let shared_secret = '9iKfnw5xvy0tY0mZdow6fBwkINykYLQw';
  // TODO: Refactor.
  await open(`btt://update_touch_bar_widget/?shared_secret=${shared_secret}&uuid=${uuid}&text=${text}&icon_data=${icon}&background_color=${color}"`);
};

server = http.createServer( function(req, res) {

  if (req.method == 'POST') {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var body = '';
    req.on('data', function (data) {
      body = JSON.parse(data);
    });
    req.on('end', function () {
      // provider
      // var provider = body.provider;

      // map
      // var map = body.map;

      // round
      // var round = body.round;

      // player
      var player = body.player;
      if (player) {
        // player_id
        // player.steamid
        // player.name
        // player.activity

        // player_state {}
        if (player.state) {
          // health
          uuid = '1BCB9B61-34D0-408E-AD37-FF0B70ED7F8C';
          text = player.state.health;
          if (Number(text) <= 30) {
            color = "255,2,2,255"
          } else {
            color = defaultColor
          }
          bttAsyncUpdateWidget(uuid, text, iconHealth, color);

          // armor
          uuid = 'EEBE8C08-DCA1-4CC0-9FD7-BB882F1C61BB';
          text = player.state.armor;
          // helmet
          if (Number(text) <= 30) {
            color = "255,2,2,255"
          } else {
            color = defaultColor
          }
          bttAsyncUpdateWidget(uuid, text, player.state.helmet ? iconHelmet : iconArmor, color);
          // flashed
          // smoked
          // burning
          //
          // money
          //
          // round_kills
          // round_killhs
          //
          // equip_value
        }

        // player_weapons {}
        if (player.weapons) {
          let activeWeapon = Object.values(player.weapons).find(weapon => weapon.state === 'active');
          if (activeWeapon) {
            uuid = '030D854C-A80B-429C-9072-6EF393635328';
            if (activeWeapon.ammo_clip && activeWeapon.ammo_reserve) {
              let clipLeft = Math.round((Number(activeWeapon.ammo_clip) / Number(activeWeapon.ammo_clip_max)) * 100)
              if (clipLeft <= 30) {
                color = "255,2,2,255"
              } else {
                color = defaultColor
              }
              text = `${activeWeapon.ammo_clip} / ${activeWeapon.ammo_reserve}`;
            } else {
              color = defaultColor
              text = ''
            }
            bttAsyncUpdateWidget(uuid, text, iconAmmo, color);
          }
        }

        // player_match_stats {}
        // if (player.match_stats) {
        //   console.log(player.match_stats)
        // }
      }
      res.end('');
    });
  } else {
    console.log("Not expecting other request types...");
    res.writeHead(200, {'Content-Type': 'text/html'});
    var html = '<html><body>HTTP Server at http://' + host + ':' + port + '</body></html>';
    res.end(html);
  }

});

server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
