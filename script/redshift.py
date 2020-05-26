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
            frequency=int(data["frequency"])
            redshifts=getRedshiftList(mass,radius,minimum,maximum,step)
            shifted_frequencies=[]
            for redshift in redshifts:
                if (isinstance(redshift,complex)):
                    shifted_frequency=0
                else:
                    shifted_frequency=redshift*frequency
                shifted_frequencies.append(shifted_frequency)
            return {"shifted_frequencies":shifted_frequencies}
        elif request=="getRedshift":
            distance=int(data["distance"])*1000 #km to m
            frequency=int(data["frequency"])
            redshift=getRedshift(mass,radius+distance)
            if (isinstance(redshift,complex)):
                shifted_frequency=0
                redshift=str(redshift)
            else:
                shifted_frequency=frequency*redshift
            return {"redshift":redshift,"shifted_frequency":shifted_frequency}
        else:
            raise Exception("request error")
    except Exception as e:
       return(str(e))

def getRedshift(M,r):
    #M object mass (kg), r distance between photonand object center (m)
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
    return(redshifts)
