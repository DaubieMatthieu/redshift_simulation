#import matplotlib.pyplot as plt

def getDataFromJquery(data):
    try:
        solar_mass=2*10**30 #solar mass in kg
        mass=int(float(data["mass"])*10**6*solar_mass) #billion solar mass to kg
        radius=int(data["radius"])*1000 #km to m
        request=data["request"]
        if request=="getRedshiftGradient":
            minimum=0
            maximum=int(data["distance"])*1000 #km to m
            valuesnumber=int(data["valuesnumber"]);
            step=int((maximum-minimum)/valuesnumber) #100values and km to m
            wavelength=int(data["wavelength"])
            redshifts=getRedshiftList(mass,radius,minimum,maximum,step)
            shifted_frequencies=[]
            for redshift in redshifts:
                if (isinstance(redshift,complex)):
                    shifted_wavelength=0
                else:
                    shifted_wavelength=redshift*wavelength
                shifted_frequencies.append(shifted_wavelength)
            return {"shifted_frequencies":shifted_frequencies}
        elif request=="getRedshift":
            distance=int(data["distance"])*1000 #km to m
            wavelength=int(data["wavelength"])
            redshift=getRedshift(mass,radius+distance)
            if (isinstance(redshift,complex)):
                shifted_wavelength=0
                redshift=str(redshift)
            else:
                shifted_wavelength=wavelength*redshift
            return {"redshift":redshift,"shifted_wavelength":shifted_wavelength}
        else:
            raise Exception("request error")
    except Exception as e:
       return(str(e))

def getRedshift(M,r):
    #M object mass (kg), r distance between photon and object center (m)
    G=float(6.674*(10**-11))
    c=299792458
    z=(1-2*G*M/(r*c**2))**-0.5
    return z

def getRedshiftList(mass,radius,minimum,maximum,step):
    #mass in solar mass unit
    #radius, minimum, maximum and step in km
    distances=[*range(minimum,maximum,step)]
    redshifts=[]
    for distance in distances:
        redshift=getRedshift(mass,radius+distance)
        redshifts.append(redshift)
    return redshifts
