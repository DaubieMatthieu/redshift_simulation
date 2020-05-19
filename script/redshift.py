def getRedshift(data):
    Ms=2*10**30 #masse solaire
    M=float(data["mass"])*10**6*Ms
    r=float(data["radius"])*1000
    d=float(data["distance"])*1000
    z=calculateRedshift(M,r+d)
    return z

def calculateRedshift(M,r):
    #M masse du corps massif (kg), r distance entre le photon et le centre du corps massif (m)
    G=6.674*(10**-11)
    c=299792458
    z=(1-2*G*M/(r*c**2))**-0.5-1
    return z
