import os 

def register():
    import widget
    
def get_resource_dir():
    return os.path.join(os.path.dirname(__file__), 'resources')
        
def get_js(thirdparty=True):
    js = ['widget.js']
    if thirdparty:
        js.append('jquery-ui-1.8.1.custom.min.js')
    return js

def get_css(thirdparty=True):
    if thirdparty:
        return ['jquery-ui-1.8.1.custom.css']